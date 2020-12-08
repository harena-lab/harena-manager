'use strict'

const Institution = use('App/Models/v1/Institution')

const uuidv4 = require('uuid/v4')

class InstitutionController {
  async store ({ request, response }) {
    try {
      const institution = new Institution()

		    institution.id = await uuidv4()
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

  async listInstitutions ({ request, response }) {
    try {
      const institutions = await Institution
        .query()
        .where('acronym', '!=', 'uni')
        .fetch()


      return response.json(institutions)
      } catch (e) {
          console.log(e)
      return response.status(500).json({ message: e.message })
      }
  }

}

module.exports = InstitutionController
