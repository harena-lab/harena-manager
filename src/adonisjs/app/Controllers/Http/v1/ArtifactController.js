'use strict'

const Helpers  = use('Helpers')
const Artifact = use('App/Models/v1/Artifact');
const Case     = use('App/Models/v1/Case');
const Env      = use('Env')
const uuid4     = require('uuid/v4');
const fs     = require('fs');


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

			const fileLocation             = request.body.file
			const caseID           = request.body.case_uuid
			// request.input('case_uuid', null)
			console.log(fileLocation)
			fs.openSync(fileLocation)
			var linkedCase = await Case.find(caseID)
	
			if (caseID != null && linkedCase == null){
				return response.json({ message: "Case id not found" })
			} 
			
			let fsPath = Helpers.publicPath(this.relativePath)
			let caseRelativePath = this.relativePath
			if (caseID != null){
				fsPath += 'cases/' + caseID + '/'
				caseRelativePath += 'cases/' + caseID + '/'
			}
			
			const artifactID       = await uuid4() 
			// console.log("file " +file)
			const artifactFileName = artifactID + "." + file.extname
	
			await file.move(fsPath, {name: artifactFileName, overwrite: false})
	
			const artifact = new Artifact()
			artifact.fs_path       = fsPath + artifactFileName 
			artifact.relative_path = caseRelativePath + artifactFileName
			artifact.case_id       = linkedCase != null ? linkedCase.uuid : linkedCase;
			await auth.user.artifacts().save(artifact)
		
			const base_url = Env.getOrFail('APP_URL')
		
			let bodyMessage = { message:       "Artifact successfully stored",
								filename:      artifactFileName,
								case:          linkedCase,										   
								size_in_bytes: file.size,
								type:          file.type,
								subtype:       file.subtype,
								extension:     file.extname,
								status:        file.status,
								relative_path: artifact.relative_path,
								url:           base_url+artifact.relative_path 
			}

			return response.status(200).json(bodyMessage)
		} catch(e){
			console.log(e)
      		return response.status(e.status).json({ message: e.message })
		}


	}

}

module.exports = ArtifactController
