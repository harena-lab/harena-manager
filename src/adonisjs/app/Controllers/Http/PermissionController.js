'use strict'

const uuidv4 = require('uuid/v4')


const Permission = use('App/Models/v1/Permission')
const Environment = use('App/Models/Environment')


class PermissionController {
  async store ({ request, response }) {
    try {
      let permission = new Permission()
        permission.id = await uuidv4()

		    permission.clearance = request.input('clearance')
		    permission.subject_grade = request.input('subject_grade')
		    permission.resource = request.input('resource')
	  	  permission.resource_id = request.input('resource_id')


        let environment = await Environment.findBy('name', request.input('environment'))
        permission.environment_id = environment.id



		    await permission.save()

		    response.json('permission successfully created')
	    } catch (e) {
      		console.log(e)
      return response.status(500).json({ message: e.message })
    	}
  }
}

module.exports = PermissionController
