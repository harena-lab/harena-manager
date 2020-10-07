'use strict'

const Database = use('Database')
const uuidv4 = require('uuid/v4')

const Artifact = use('App/Models/v1/Artifact')
const Env = use('Env')
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

  async listCases ({ request, response, auth }) {
    try {
      const user = await auth.user
      const categoryId = request.input('categoryId')
      const category = await Category.find(categoryId)
      const test = await Database
        .select('*')
        .from('users_cases')
        .where('user_id', user.id)
        .where('cases.category_id', category.id)
        .leftJoin('cases', 'users_cases.case_id', 'cases.id')


      return response.json(test)
    } catch (e) {
      console.log(e)
    }
  }

  async listCategories ({ request, response, auth }) {
    try {
      const resultCategory = await Category.all()
      const baseUrl = Env.getOrFail('APP_URL')
      const category = []
      console.log(baseUrl)

      for (var i = 0; i < resultCategory.rows.length; i++) {
        const categoryJSON = {}
        categoryJSON.id = resultCategory.rows[i].id
        categoryJSON.title = resultCategory.rows[i].title
        categoryJSON.template = resultCategory.rows[i].template

        const artifact = await Artifact.find(resultCategory.rows[i].artifact_id)
        console.log(artifact)
        categoryJSON.url = baseUrl + artifact.relative_path

        category.push(categoryJSON)
      }
      return response.json(category)
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }
}
module.exports = CategoryController
