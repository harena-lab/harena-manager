'use strict'

const Helpers  = use('Helpers')
const Artifact = use('App/Models/v1/Artifact');
const Case     = use('App/Models/v1/Case');
const Env      = use('Env')
const uuid4     = require('uuid/v4');

class ArtifactController {

	constructor(){
 		// See this for more on MIM types: https://docs.openx.com/Content/publishers/adunit_linearvideo_mime_types.html
		this.validationOptions = {
			  						size:     '100mb',
			  						types:    ['image','video'],
			  						extnames: ['png', 'jpg', 'jpeg', 'gif','mp4','avi', '.wmv']
								  }

		this.relativePath     = '/resources/artifacts/' 


	}

	async store({ request, auth, response }) {
		try{

			const file             = request.file('file', this.validationOptions)
			const case_id           = request.input('case_id', null)
			
			var c = await Case.find(case_id)
	
			if (case_id != null && c == null){
				return response.json({ message: "Case id not found" })
			} 
			
			let fs_path = Helpers.publicPath(this.relativePath)
			let case_relative_path = this.relativePath
			if (case_id != null){
				fs_path += 'cases/' + case_id + '/'
				case_relative_path += 'cases/' + case_id + '/'
			}
			
			const artifact_id       = await uuid4() 
			const artifact_file_name = artifact_id + "." + file.extname
	
			await file.move(fs_path, {name: artifact_file_name, overwrite: false})
	
			const artifact = new Artifact()
			artifact.id       = artifact_id
			artifact.fs_path       = fs_path + artifact_file_name
			artifact.relative_path = case_relative_path + artifact_file_name
			artifact.case_id       = c != null ? c.id : c;
		
			const base_url = Env.getOrFail('APP_URL')
		
			let bodyMessage = { message:       "Artifact successfully stored",
								filename:      artifact_file_name,
								case:          c,										   
								size_in_bytes: file.size,
								type:          file.type,
								subtype:       file.subtype,
								extension:     file.extname,
								status:        file.status,
								relative_path: artifact.relative_path,
								url:           base_url+artifact.relative_path 
			}

			await auth.user.artifacts().save(artifact)

			return response.status(200).json(bodyMessage)
		} catch(e){
			console.log(e)
      		return response.status(e.status).json({ message: e.message })
		}
	}

// O CÓDIGO COMENTADO É PRA NO FUTURO QUANDO A PASTA DAS IMAGENS FOR RESOURCES INVES DE PUBLIC 

	// async store({ request, auth, response }) {
	// 	try{

	// 		const file             = request.file('file', this.validationOptions)
	// 		const case_id           = request.input('case_id', null)
			
	// 		var c = await Case.find(case_id)
	
	// 		if (case_id != null && c == null){
	// 			return response.json({ message: "Case id not found" })
	// 		} 
			
	// 		let fs_path = Helpers.resourcesPath() + '/artifacts/'
	// 		let case_relative_path = Helpers.resourcesPath() + '/artifacts/' 
	// 		if (case_id != null){
	// 			fs_path += 'cases/' + case_id + '/'
	// 			case_relative_path += 'cases/' + case_id + '/'
	// 		}
			
	// 		const artifact_id       = await uuid4() 
	// 		const artifact_file_name = artifact_id + "." + file.extname
	
	// 		await file.move(fs_path, {name: artifact_file_name, overwrite: false})
	
	// 		const artifact = new Artifact()
	// 		artifact.id       = artifact_id
	// 		artifact.fs_path       = fs_path + artifact_file_name
	// 		artifact.relative_path = case_relative_path + artifact_file_name
	// 		artifact.case_id       = c != null ? c.id : c;
		
	// 		const base_url = Env.getOrFail('APP_URL')
		
	// 		let bodyMessage = { message:       "Artifact successfully stored",
	// 							filename:      artifact_file_name,
	// 							case:          c,										   
	// 							size_in_bytes: file.size,
	// 							type:          file.type,
	// 							subtype:       file.subtype,
	// 							extension:     file.extname,
	// 							status:        file.status,
	// 							relative_path: artifact.relative_path,
	// 							url:           base_url+artifact.relative_path 
	// 		}

	// 		await auth.user.artifacts().save(artifact)

	// 		return response.status(200).json(bodyMessage)
	// 	} catch(e){
	// 		console.log(e)
 //      		return response.status(e.status).json({ message: e.message })
	// 	}


	// }

}

module.exports = ArtifactController

