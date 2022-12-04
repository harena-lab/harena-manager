'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const Drive = use('Drive')
const Helpers = use('Helpers')

const User = use('App/Models/v1/User')
const Case = use('App/Models/v1/Case')
const CaseVersion = use('App/Models/v1/CaseVersion')
const Institution = use('App/Models/v1/Institution')
const Permission = use('App/Models/v1/Permission')
const Property = use('App/Models/v1/Property')
const CaseProperty = use('App/Models/v1/CaseProperty')
const CaseAnnotation = use('App/Models/v1/CaseAnnotation')
const UsersGroup = use('App/Models/v1/UsersGroup')
const Group = use('App/Models/Group')
const Artifact = use('App/Models/v1/Artifact')
const CaseArtifacts = use('App/Models/CaseArtifact')

const uuidv4 = require('uuid/v4')

/** * Resourceful controller for interacting with cases */
class CaseController {
  /** Show a list of all cases */
  // Protected by middleware 'is:admin'
  async index ({ request, response }) {
    try {
      const cases = await Case.all()
      return response.json(cases)
    } catch (e) {
      return response.status(500).json({ message: e.message })
    }
  }

  /**
   * Display a single case.
   * GET cases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ request, response }) {
    try {

      const c = await Case.find(request.input('caseId'))

      if (c != null) {
        const versions = await CaseVersion.query()
          .where('case_id', '=', request.input('caseId'))
          .orderBy('created_at', 'desc')
          .limit(1)
          .fetch()

        const properties = await Database
          .select(['properties.title', 'case_properties.value'])
          .from('case_properties')
          .leftJoin('properties', 'case_properties.property_id', 'properties.id')
          .where('case_properties.case_id', request.input('caseId'))

          var prop = {}

        for(let p in properties){
          let title = properties[p].title
          let value = properties[p].value
          prop[title] = value
        }

        c.source = versions.last().source
        // c.versions = versions
        c.property = prop

        const caseAuthor = await User.find(c.author_id)
        const institution = await Institution.find(c.institution_id)
        c.institution_acronym = institution.acronym
        c.institution = institution.title
        c.institution_country = institution.country
        c.username = caseAuthor.username

        return response.json(c)
      } else return response.status(500).json('case not found')
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }


  /**  * Create/save a new case. */
  async store ({ request, auth, response }) {
    const trx = await Database.beginTransaction()

    try {


      const c = new Case()
      c.id = await uuidv4()
      c.title = request.input('title')
      c.description = request.input('description')
      c.language = request.input('language')
      c.domain = request.input('domain')
      c.specialty = request.input('specialty')
      c.keywords = request.input('keywords')
      c.original_date = request.input('original_date')
      c.complexity = request.input('complexity')
      c.published = 0

      c.author_grade = auth.user.grade
      c.author_id = auth.user.id

      const cv = new CaseVersion()
      cv.id = await uuidv4()
      cv.source = request.input('source')
      await c.versions().save(cv, trx)

      /*
      const permission = new Permission()
      permission.id = await uuidv4()
      permission.entity = request.input('permissionEntity') || 'institution'
      permission.subject = request.input('permissionSubjectId') || auth.user.institution_id
      permission.clearance = request.input('permissionClearance') || '1'
      permission.table = 'cases'
      permission.table_id = c.id

      permission.save(trx)
      */

      let institution = await Institution.find(auth.user.institution_id)
      await c.institution().associate(institution, trx)

      trx.commit()

      c.versions = await c.versions().fetch()

      return response.json(c)
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  /** * Update case details. PUT or PATCH case/:id */
  async update ({ auth, request, response }) {
    const trx = await Database.beginTransaction()
    var canEdit = false
    try {
      const c = await Case.find(request.input('caseId'))

      if (c != null) {
        if(c.author_id == auth.user.id){
          canEdit = true
        }else{
          var casePermission = await Permission
            .query()
            .where('table', 'cases')
            .where('table_id', c.id)
            .where('clearance', '>=', '4')
            .fetch()
          casePermission = casePermission.toJSON()
          for(var _permission in casePermission){
            if((casePermission[_permission]['entity'] == 'user' && casePermission[_permission]['subject'] == auth.user.id)
            || (casePermission[_permission]['entity'] == 'institution' && casePermission[_permission]['subject'] == auth.user.institution_id)){
              canEdit = true
            }else if(casePermission[_permission]['entity'] == 'group'){

              var group = await UsersGroup
                .query()
                .where('group_id', casePermission[_permission]['subject'])
                .where('user_id', auth.user.id)
                .first()
              if(group){
                canEdit = true
              }
            }
          }
        }
        if (canEdit) {
          const versions = await CaseVersion.query()
          .where('case_id', '=', request.input('caseId'))
          .orderBy('created_at', 'asc')
          .fetch()

          c.title = request.input('title') || c.title
          c.description = request.input('description')|| c.description
          c.language = request.input('language')|| c.language
          c.domain = request.input('domain')|| c.domain
          c.specialty = request.input('specialty')|| c.specialty
          c.keywords = request.input('keywords')|| c.keywords
          c.original_date = request.input('originalDate')|| c.original_date
          c.complexity = request.input('complexity')|| c.complexity
          c.published = request.input('published')|| c.published

          const cv = new CaseVersion()
          cv.source = request.input('source')|| versions.last().source
          cv.id = await uuidv4()
          await c.versions().save(cv)

          const institutionAcronym = request.input('institution')
          if (institutionAcronym != null){
            let institution = await Institution.findBy('acronym', institutionAcronym)
            await c.institution().associate(institution)
          }

          const permission = new Permission()
          permission.id = await uuidv4()
          permission.entity = request.input('permissionEntity')
          permission.subject = request.input('permissionSubjectId')
          permission.clearance = request.input('permissionClearance')
          permission.table = 'cases'
          permission.table_id = c.id
          await permission.save(trx)

          await c.save()

          trx.commit()

          c.source = cv.source

          return response.json(c)
        }else {
          trx.rollback()
          return response.json({error:"Error ocurred, you don't have permission to save the changes."})
        }

      } else return response.status(500).json('Case not found.')
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(500).json({ message: e })
    }
  }

  /**
   * Delete a case with id.
   * DELETE cases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const c = await Case.findBy('id', request.input('caseId'))
      if (c != null) {
        await c.versions().delete()
        await Permission
          .query()
          .where('table', 'cases')
          .where('table_id', c.id)
          .delete()
        await CaseProperty
          .query()
          .where('case_id', c.id)
          .delete()

        let _caseArtifacts = await Database
          .from('case_artifacts')
          .where('case_id', c.id)
          .select('artifact_id')
        await c.artifacts().delete()

        for (let i in _caseArtifacts) {
          let artifact = await Artifact.find(_caseArtifacts[i].artifact_id)
          await artifact.delete()
        }

        console.log('================= deleting the directory')
        let dir_delete = Helpers.publicPath('/resources/artifacts/cases/') + c.id
        console.log(dir_delete)
        Drive.delete(dir_delete)

        await c.delete(trx)

        trx.commit()
        return response.json(c)
      } else {
        trx.rollback()
        return response.status(500).json('case not found')
      }
    } catch (e) {
      trx.rollback()

      console.log(e)
      return response.status(500).json({ message: e })
    }
  }

  async share ({params, request, response, auth}){
    const trx = await Database.beginTransaction()

    try {
      var canShare = false
      var highestClearance = 0
      const entity = request.input('entity')
      const subject = request.input('subject')
      const subject_grade = request.input('subject_grade')
      const clearance = request.input('clearance')
      const table_id = request.input('table_id').split(',')

      for (let c in table_id){
        console.log(table_id[c])
        var _case = await Case.findBy('id', table_id[c])
        if(_case){
          /////////////////////////////
          if(_case.author_id == auth.user.id){
            canShare = true
            highestClearance = 10
            // console.log('============')
            // console.log('User is the author of case')
            // console.log('============')

          }else{
            var casePermission = await Permission
              .query()
              .where('table', 'cases')
              .where('table_id', _case.id)
              .where('clearance', '>=', '3')
              .fetch()
            casePermission = casePermission.toJSON()
            // console.log('============')
            // console.log(casePermission)
            // console.log('============')
            for(var _permission in casePermission){
              if((casePermission[_permission]['entity'] == 'user' && casePermission[_permission]['subject'] == auth.user.id)
              || (casePermission[_permission]['entity'] == 'institution' && casePermission[_permission]['subject'] == auth.user.institution_id)){
                // console.log('============')
                // console.log('User is part of a institution or user able to edit')
                // console.log('============')
                if(casePermission[_permission]['clearance'] > highestClearance)
                  highestClearance = casePermission[_permission]['clearance']
                canShare = true
              }else if(casePermission[_permission]['entity'] == 'group'){

                var group = await UsersGroup
                  .query()
                  .where('group_id', casePermission[_permission]['subject'])
                  .where('user_id', auth.user.id)
                  .first()
                if(group){
                  // console.log('============')
                  // console.log('User is part of a group able to edit')
                  // console.log('============')
                  if(casePermission[_permission]['clearance'] > highestClearance)
                    highestClearance = casePermission[_permission]['clearance']
                  canShare = true
                }
              }
            }
          }
          ////////////////////////////

          /*Transforms subject entry into respective id from table, depending on entity type
            Also verifies if object exists e.g.(user with email test@test)
            Default value usually is institution id
          */
          var _subject = await Institution.find(subject) || await Institution.findBy('acronym', subject)
          if(entity =='user'){
            if(subject.includes('@'))
              _subject = await User.findBy('email',subject)
            else
              _subject = await User.find(subject)
          }else if(entity =='group'){
            _subject = await Group.findBy('title', subject) || await Group.find(subject)
          }

          if(canShare && clearance < highestClearance && _subject){
            let permission = new Permission()
            permission.id = await uuidv4()
            permission.entity = entity
            permission.subject = _subject.id
            permission.subject_grade = subject_grade
            permission.clearance = clearance
            permission.table = 'cases'
            permission.table_id = table_id[c]
            await permission.save(trx)

          }else if (!canShare){
            trx.rollback()
            return response.status(500).
            json({message:"Error. Couldn't share the case. Your permission is not high enough, contact the author of the case."})
          }else if(!_subject || _subject == undefined){
            switch (entity) {
              case 'institution':
              trx.rollback()
                return response.status(500).
                json({message:"Error. Couldn't find the informed institution, you probably forgot to select one. Please review and try again."})
                break
              case 'user':
              trx.rollback()
                return response.status(500).
                json({message:"Error. Couldn't find an user with the informed email. Please review and try again."})
                break
              case 'group':
              trx.rollback()
                return response.status(500).
                json({message:"Error. Couldn't find a group with the informed title. Please review and try again."})
                break
              default:
            }

          }else{
            trx.rollback()
            return response.status(500).
            json({message:"Error. Couldn't share one or more cases. You're trying to share a case with higher permission than what you actually have. Please lower the permission (example: 'Play' or 'Share')"})
          }
        }else{
          trx.rollback()
          return response.status(500).
          json({message:'Error. Could not find the case id, please review and try again'})
        }
      }

      trx.commit()
      return response.json({message:'Cases shared successfully!'})
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(500).json({ message: e.message })
    }

  }

  async withdraw ({params, request, response, auth}){
    try {
      const status = await Database
        .from('permissions')
        .where('entity', request.input('entity'))
        .where('subject', request.input('subject'))
        .where('table_id', request.input('table_id'))
        .del()
      if (status != null)
        return response.json(status)
      else
        return response.status(500).json('user not found')
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }

  async storeProperty ({params, request, auth, response}) {
    const trx = await Database.beginTransaction()
    try {
      const case_id = request.input('case_id')
      const property_title = request.input('property_title')
      const property_value = request.input('property_value')

      const property = await Property.findOrCreate(
        { title: property_title },
        { id: await uuidv4(), title: property_title }, trx
      )
      // const caseProperty = new CaseProperty()
      // caseProperty.case_id = case_id
      // caseProperty.property_id = property.id
      // caseProperty.value = property_value
      let caseProperty = await CaseProperty.findOrCreate(
        { case_id: case_id, property_id: property.id},
        { case_id: case_id, property_id: property.id, value: property_value}, trx
      )

      await property.save(trx)
      await caseProperty.save(trx)

      trx.commit()

      return response.json({property: property, case_property: caseProperty})

    } catch (e) {
      trx.rollback()
      console.log('============catch error storeProperty')
      console.log(e)
      return response.status(e.status).json({ message: e.message})
    }
  }

  async updateProperty ({request, auth, response}) {
    const trx = await Database.beginTransaction()
    try {
      const case_id = request.input('case_id')
      const property_title = request.input('property_title')
      const property_value = request.input('property_value')

      const property = await Property.findBy('title', property_title)

      // const caseProperty = await CaseProperty.findOrCreate(
      //   { case_id: case_id, property_id: property.id },
      //   { case_id: case_id, property_id: property.id}, trx
      // )

      let caseProperty = await CaseProperty
        .query()
        .where('property_id', property.id)
        .where('case_id', case_id)
        .fetch()
      caseProperty = caseProperty.last()

      await trx
      .table('case_properties')
      .where('property_id', property.id)
      .where('case_id', case_id)
      .update({ value: property_value,})
      // console.log('============ db case property')
      // console.log(caseProperty)

      caseProperty.value = property_value

      // console.log('============ value')
      // console.log(caseProperty.value)
      trx.commit()


      return response.json(caseProperty)
    } catch (e) {
      trx.rollback()
      console.log('============catch error updateProperty')
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }

  async destroyProperty ({params, request, auth, response}) {
    try {

    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  async storeAnnotation ({params, request, auth, response}) {
    const trx = await Database.beginTransaction()
    try {
      const ann = new CaseAnnotation()

      ann.case_id = request.input('case_id')
      const cs = await Case.find(ann.case_id)

      if (cs != null) {
        ann.property_id = request.input('property_id') || 'dc:description'
        const prp = await Property.find(ann.property_id)
        if (prp != null) {
          ann.range = request.input('range')
          if (ann.range != null) {
            ann.user_id = auth.user.id
            ann.fragment = request.input('fragment')
            ann.property_value = request.input('property_value')
            ann.source = request.input('source')
            await ann.save(trx)
            trx.commit()
            return response.json(ann)
          } else {
            trx.rollback()
            return response.status(500).json('range is mandatory')
          }
        } else {
          trx.rollback()
          return response.status(500).json('property not found')
        }
      } else {
        trx.rollback()
        return response.status(500).json('case not found')
      }
    } catch (e) {
      trx.rollback()
      console.log('============ catch error storeAnnotation')
      console.log(e)
      return response.status(e.status).json({ message: e.message})
    }
  }

  async listAnnotations ({ request, response }) {
    try {
      const case_id = request.input('case_id')
      const cs = await Case.find(case_id)

      return response.json(await cs.annotations().fetch())
    } catch (e) {
      console.log(e)
    }
  }

  async destroyAnnotation ({params, request, auth, response}) {
    try {

    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }
}

module.exports = CaseController
