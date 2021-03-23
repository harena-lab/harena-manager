'use strict'

const uuidv4 = require('uuid/v4')


const Semantics = use('App/Models/Semantics')


class SemanticsController {
  async store ({ params, request, auth, response }) {
    try {
      const semantics = new Semantics()

      semantics.id = await uuidv4()
      semantics.ontology = request.input('ontology')
      semantics.uri = request.input('uri')
      semantics.resource = request.input('resource')
      semantics.resource_id = params.id
      await semantics.save()
    } catch (e) {
      console.log(e)
      if (e.code === 'ER_DUP_ENTRY') {
          return response.status(409).json(e.sqlMessage)
      }

      return response.status(e.status).json({ message: e.message })
    }
  }
}

module.exports = SemanticsController
