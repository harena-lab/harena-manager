'use strict'

const Database = use('Database')
const uuidv4 = require('uuid/v4')

const Category = use('App/Models/v1/Category')
const Case = use('App/Models/v1/Case')

class CategoryController {
  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {

      const category = new Category()
      category.id = await uuidv4()

      const c = request.all()
      c.artifact_id = c.artifact_id ? c.artifact_id : 'default-quest-image'

      category.merge(c)

      await category.save(trx)

      trx.commit()

      return response.json(category)
    } catch (e) {
      trx.rollback()
      console.log(e)

      return response.status(e.status).json({ message: e.message })
    }
  }


  async linkCase ({ request, response }) {
    try {
      const { categoryId, caseId } = request.post()

      const category = await Category.find(categoryId)
      const c = await Case.find(caseId)

      await category.cases().save(c)

      return response.json('category and case successfully linked')
    } catch (e) {
      console.log(e)
      return response.status(500).json(e)
    }
  }


  async listCases ({ request, response }) {
    try {
      const categoryId = request.input('categoryId')
      const category = await Category.find(categoryId)

      return response.json(await category.cases().fetch())
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = CategoryController
