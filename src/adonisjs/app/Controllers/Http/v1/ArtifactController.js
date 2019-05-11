'use strict'

const Helpers  = use('Helpers')
const Artifact = use('App/Models/v1/Artifact');
const Case     = use('App/Models/v1/Case');
const Env      = use('Env')
const uuid     = require('uuid/v4');

class ArtifactController {

	constructor(){

 		// See this for more on MIM types: https://docs.openx.com/Content/publishers/adunit_linearvideo_mime_types.html
		this.validationOptions = {
			  						size:     '100mb',
			  						types:    ['image','video'],
			  						extnames: ['png', 'jpg', 'jpge', 'gif','mp4','avi', '.wmv']
								  }

		this.relativePath     = '/artifacts/' 


	}

	async store({ request, auth, response }) {

		try{

			const file             = request.file('file', this.validationOptions)
			const caseID           = request.input('case_id', null)
	
			const artifactID       = await uuid() 
			const artifactFileName = artifactID + "." + file.extname
			const fsPath           = Helpers.publicPath(this.relativePath)
	
	
			await file.move(fsPath, {name: artifactFileName, overwrite: false})
	
			  if (!file.moved()) 
				return file.error()
			
	
	
			var linkedCase = await Case.find(caseID)

			if (caseID != null && linkedCase == null){
				return response.json({ message: "User id not found" })
			} 
	
	
			const artifact = new Artifact()
			artifact.fs_path       = fsPath + artifactFileName 
			artifact.relative_path = this.relativePath + artifactFileName
			artifact.case_id       = linkedCase != null ? linkedCase.id : linkedCase;
			await auth.user.artifacts().save(artifact)
	
			 const base_url = Env.getOrFail('APP_URL')
	
	
	
			return response.status(200).json({ message:       "Artifact successfully stored",
											   filename:      artifactFileName,
											   case:          linkedCase,										   
											   size_in_bytes: file.size,
											   type:          file.type,
											   subtype:       file.subtype,
											   extension:     file.extname,
											   status:        file.status,
											   relative_path: artifact.relative_path,
											   url:           base_url+artifact.relative_path 
	
			 })
		} catch(e){
			console.log(e)
      		return response.status(e.status).json({ message: e.message })
		}


	}

}

module.exports = ArtifactController
