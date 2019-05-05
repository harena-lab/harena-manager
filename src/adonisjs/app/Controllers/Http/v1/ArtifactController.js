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

		this.relative_path     = '/artifacts/' 


	}

	async store({ request, auth, response }) {


		const file = request.file('file', this.validationOptions)

		const filename = await uuid() + "." + file.extname
		const fs_path  = Helpers.publicPath(this.relative_path)
		const case_id   = request.input('case_id', null)


		await file.move(fs_path, {name: filename, overwrite: false})

	  	if (!file.moved()) 
	    	return file.error()
	    

	    var linked_case = null

	    try{	
	    	linked_case = await Case.find(case_id)
		}catch(e){
			console.log(e)
		}	


		const artifact = new Artifact()
		artifact.fs_path       = fs_path + filename 
		artifact.relative_path = this.relative_path + filename
		artifact.case_id = linked_case
	    await auth.user.artifacts().save(artifact)

 		const base_url = Env.getOrFail('APP_URL')



		return response.status(200).json({ message:       "Artifact successfully stored",
										   filename:      filename,
										   case:          linked_case,										   
										   size_in_bytes: file.size,
										   type:          file.type,
										   subtype:       file.subtype,
										   extension:     file.extname,
										   status:        file.status,
										   relative_path: artifact.relative_path,
										   url:           base_url+this.relative_path+filename

		 })

	}

}

module.exports = ArtifactController
