'use strict'

const Database = use('Database')
const uuidv4 = require('uuid/v4')

const Artifact = use('App/Models/v1/Artifact')
const Env = use('Env')
const Category = use('App/Models/v1/Category')
const Case = use('App/Models/v1/Case')


class CategoryController {
  async store ({ request, response }) {
    try {
      const trx = await Database.beginTransaction()

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


  async update ({ params, request, response }) {
    try {
      const category = await Category.find(params.id)

      if (category != null) {
        category.title = request.input('title') || null

      if (request.input('artifactId')){
        category.artifact_id = request.input('artifactId')
      }

        await category.save()
        return response.json(category)
      } else return response.status(500).json('category not found')
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e })
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


      const clearance = parseInt(request.input('clearance'))
      const categoryId = request.input('categoryId')
      const category = await Category.find(categoryId)

      var publishedFilter = parseInt(request.input('published')) || 0

      const institutionFilter = request.input('fInstitution') || `%`
      const userTypeFilter = request.input('fUserType') || `%`
      const specialtyFilter = request.input('fSpecialty') || `%`


      const test = await Database
        .select([ 'cases.id', 'cases.title','cases.description', 'cases.language', 'cases.domain',
        'cases.specialty', 'cases.keywords', 'cases.complexity', 'cases.original_date',
        'cases.author_grade', 'cases.published', 'users.username',
        'institutions.title AS institution', 'institutions.acronym AS institution_acronym',
        'institutions.country AS institution_country', 'cases.created_at'])
        .distinct('cases.id')
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .join('users', 'users.id', 'cases.author_id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('cases.category_id', category.id)
        .where('cases.published', '>=', publishedFilter)
        .where('cases.institution_id', 'like', institutionFilter)
        .where('cases.author_grade', 'like', userTypeFilter)
        .where(function(){
          if (specialtyFilter != '%')
            this.where('cases.specialty', 'like', specialtyFilter)
        })

        .where(function(){
          this
          .where('cases.author_id', user.id)
          .orWhere(function () {
            this
            .where('permissions.entity', 'institution')
            .where('permissions.subject', user.institution_id)
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .orderBy('cases.created_at', 'desc')

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
