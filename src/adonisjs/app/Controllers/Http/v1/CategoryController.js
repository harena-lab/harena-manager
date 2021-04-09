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


      const clearance = parseInt(request.input('clearance')) || 10
      const categoryId = request.input('categoryId')
      const category = await Category.find(categoryId)

      var publishedFilter = parseInt(request.input('published')) || 0

      const institutionFilter = request.input('fInstitution') || `%`
      const userTypeFilter = request.input('fUserType') || `%`
      const specialtyFilter = request.input('fSpecialty') || `%`
      const propertyFilter = request.input('fProperty') || null
      const propertyValueFilter = request.input('fPropertyValue') || `%`

      var itemOffset = 0
      const itemLimit = request.input('nItems') || 20
      if (request.input('page') && request.input('page') < 1)
        itemOffset = 0
      else
        itemOffset = request.input('page') -1 || 0

      let result = null
      var totalPages = null
      // console.log(institutionFilter)
      // console.log(userTypeFilter)
      if(propertyFilter != null){


        let countCases = await Database
         .from('cases')
         .join('case_properties', 'case_properties.case_id', 'cases.id')
         .join('properties', 'properties.id', 'case_properties.property_id')
         .leftJoin('permissions', 'cases.id', 'permissions.table_id')
         .join('users_groups')
         .join('users', 'cases.author_id','users.id')
         .join('institutions', 'users.institution_id', 'institutions.id')
         .where('cases.category_id', category.id)
         .where('properties.title', propertyFilter)
         .where('case_properties.value','like', propertyValueFilter)
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
             //////
             .where(function(){
               this
               .where('cases.author_id', user.id)
               .orWhere(function () {
                 this
                 .where(function(){
                   this
                   .where(function(){
                     this
                     .where('permissions.entity', 'institution')
                     .where('permissions.subject', user.institution_id)
                   })
                   .orWhere(function(){
                     this
                     .where('permissions.entity', 'user')
                     .where('permissions.subject', user.id)
                   })
                   .orWhere(function() {
                     this
                     .where('permissions.entity', 'group')
                     .whereRaw('permissions.subject = users_groups.group_id')
                     .where('users_groups.user_id', user.id)
                   })
                 })
                 .where('permissions.clearance', '>=', clearance)
                 .where(function(){
                   this
                   .whereNull('permissions.subject_grade')
                   .orWhere('permissions.subject_grade', user.grade)
                 })
               })
             })
             .where('permissions.clearance', '>=', clearance)
             .where(function(){
               this
               .whereNull('permissions.subject_grade')
               .orWhere('permissions.subject_grade', user.grade)
             })
           })
         })
         .countDistinct('cases.id as cases')

        totalPages = Math.ceil(countCases[0]['cases'] / itemLimit)

        if(itemOffset >= totalPages)
          itemOffset = 0

        const selectPropertyTitle = ('case_properties.value AS ' + propertyFilter)
        result = await Database
        .select([ 'cases.id', 'cases.title','cases.description', 'cases.language', 'cases.domain',
        'cases.specialty', 'cases.keywords', 'cases.complexity', 'cases.original_date',
        'cases.author_grade', 'cases.published', 'users.username',
        'institutions.title AS institution', 'institutions.acronym AS institution_acronym',
        'institutions.country AS institution_country', 'cases.created_at',
        Database.raw(`CASE WHEN case_properties.value = 0 AND properties.title = 'feedback'
        THEN 'Waiting for feedback' WHEN case_properties.value = 1 AND properties.title = 'feedback'
        THEN 'Feedback complete' ELSE case_properties.value END AS ?`,[propertyFilter])])
        .distinct('cases.id')
        .from('cases')
        .join('case_properties', 'case_properties.case_id', 'cases.id')
        .join('properties', 'properties.id', 'case_properties.property_id')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .join('users_groups')
        .join('users', 'cases.author_id','users.id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('cases.category_id', category.id)
        .where('properties.title', propertyFilter)
        .where('case_properties.value','like', propertyValueFilter)
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
            //////
            .where(function(){
              this
              .where('cases.author_id', user.id)
              .orWhere(function () {
                this
                .where(function(){
                  this
                  .where(function(){
                    this
                    .where('permissions.entity', 'institution')
                    .where('permissions.subject', user.institution_id)
                  })
                  .orWhere(function(){
                    this
                    .where('permissions.entity', 'user')
                    .where('permissions.subject', user.id)
                  })
                  .orWhere(function() {
                    this
                    .where('permissions.entity', 'group')
                    .whereRaw('permissions.subject = users_groups.group_id')
                    .where('users_groups.user_id', user.id)
                  })
                })
                .where('permissions.clearance', '>=', clearance)
                .where(function(){
                  this
                  .whereNull('permissions.subject_grade')
                  .orWhere('permissions.subject_grade', user.grade)
                })
              })
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .orderBy('cases.created_at', 'desc')
        .offset(itemOffset * itemLimit)
        .limit(itemLimit)

      }else{

        let countCases = await Database
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .join('users_groups')
        .join('users', 'cases.author_id','users.id')
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
            //////
            .where(function(){
              this
              .where('cases.author_id', user.id)
              .orWhere(function () {
                this
                .where(function(){
                  this
                  .where(function(){
                    this
                    .where('permissions.entity', 'institution')
                    .where('permissions.subject', user.institution_id)
                  })
                  .orWhere(function(){
                    this
                    .where('permissions.entity', 'user')
                    .where('permissions.subject', user.id)
                  })
                  .orWhere(function() {
                    this
                    .where('permissions.entity', 'group')
                    .whereRaw('permissions.subject = users_groups.group_id')
                    .where('users_groups.user_id', user.id)
                  })
                })
                .where('permissions.clearance', '>=', clearance)
                .where(function(){
                  this
                  .whereNull('permissions.subject_grade')
                  .orWhere('permissions.subject_grade', user.grade)
                })
              })
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .countDistinct('cases.id as cases')

        totalPages = Math.ceil(countCases[0]['cases'] / itemLimit)

        if(itemOffset >= totalPages)
          itemOffset = 0

        result = await Database
        .select([ 'cases.id', 'cases.title','cases.description', 'cases.language', 'cases.domain',
        'cases.specialty', 'cases.keywords', 'cases.complexity', 'cases.original_date',
        'cases.author_grade', 'cases.published', 'users.username',
        'institutions.title AS institution', 'institutions.acronym AS institution_acronym',
        'institutions.country AS institution_country', 'cases.created_at'])
        .distinct('cases.id')
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .join('users_groups')
        .join('users', 'cases.author_id','users.id')
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
            //////
            .where(function(){
              this
              .where('cases.author_id', user.id)
              .orWhere(function () {
                this
                .where(function(){
                  this
                  .where(function(){
                    this
                    .where('permissions.entity', 'institution')
                    .where('permissions.subject', user.institution_id)
                  })
                  .orWhere(function(){
                    this
                    .where('permissions.entity', 'user')
                    .where('permissions.subject', user.id)
                  })
                  .orWhere(function() {
                    this
                    .where('permissions.entity', 'group')
                    .whereRaw('permissions.subject = users_groups.group_id')
                    .where('users_groups.user_id', user.id)
                  })
                })
                .where('permissions.clearance', '>=', clearance)
                .where(function(){
                  this
                  .whereNull('permissions.subject_grade')
                  .orWhere('permissions.subject_grade', user.grade)
                })
              })
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .orderBy('cases.created_at', 'desc')
        .offset(itemOffset * itemLimit)
        .limit(itemLimit)
      }

      return response.json({cases:result, pages:totalPages})
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
