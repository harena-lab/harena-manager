'use strict'

const Database = use('Database')

const Property = use('App/Models/v1/Property')

const uuidv4 = require('uuid/v4')

class KnowledgeController {
  async store ({params, request, auth, response}) {
    const trx = await Database.beginTransaction()
    try {
      const id = request.input('id') || await uuid4()
      const title = request.input('title')
      const description = request.input('description')

      const property = await Property.findOrCreate(
        { title: title },
        { id: id, title: title, description: description }, trx
      )
      await property.save(trx)

      trx.commit()

      return response.json({property: property})
    } catch (e) {
      trx.rollback()
      console.log('============catch error storeProperty')
      console.log(e)
      return response.status(e.status).json({ message: e.message})
    }
  }

  async update ({ params, request, response }) {
    try {
      const property = await Property.find(request.input('id'))

      if (property != null) {
        property.title = request.input('title') || property.title
        property.description =
          request.input('description') || property.description

        await property.save()
        return response.json(property)
      } else
        return response.status(500).json('property not found, update failed')
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e })
    }
  }

  async index ({ request, response }) {
    try {
      const properties = await Property.all()

      return response.json(properties)
    } catch (e) {
          console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }
}

module.exports = KnowledgeController
