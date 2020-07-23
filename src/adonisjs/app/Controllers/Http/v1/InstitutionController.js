'use strict'

const Institution = use('App/Models/v1/Institution');

const uuidv4 = require('uuid/v4');

class InstitutionController {
	async store({ request, response }) {
		try{
			let institution = new Institution()

		    institution.id =  await uuidv4()
		    institution.acronym = request.input('acronym')
		    institution.title = request.input('title')
	  	    institution.country = request.input('country')

		    await institution.save()

		    response.json('institution successfully created')
	    } catch (e) {
      		console.log(e)
			return response.status(500).json({ message: e.message })
    	}
	}

}

module.exports = InstitutionController
