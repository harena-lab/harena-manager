'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const User = use('App/Models/v1/User')
const Case = use('App/Models/v1/Case')
const CaseVersion = use('App/Models/v1/CaseVersion')
const Institution = use('App/Models/v1/Institution')
const Permission = use('App/Models/v1/Permission')

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
  async show ({ params, response }) {
    try {
      const c = await Case.find(params.id)

      if (c != null) {
        const versions = await CaseVersion.query()
          .where('case_id', '=', params.id)
          .orderBy('created_at', 'asc')
          .fetch()

        c.source = versions.last().source
        c.versions = versions

        const institution = await Institution.find(c.institution_id)
        c.institution = institution.acronym
        c.institutionTitle = institution.title

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

      const permission = new Permission()
      permission.id = await uuidv4()
      permission.entity = request.input('permissionEntity') || 'institution'
      permission.subject = request.input('permissionSubjectId') || auth.user.institution_id
      permission.clearance = request.input('permissionClearance') || '1'
      permission.table = 'cases'
      permission.table_id = c.id

      permission.save(trx)

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
  async update ({ params, request, response }) {
    const trx = await Database.beginTransaction()

    try {
      const c = await Case.find(params.id)

      if (c != null) {
        c.title = request.input('title') || null
        c.description = request.input('description')|| null
        c.language = request.input('language')|| null
        c.domain = request.input('domain')|| null
        c.specialty = request.input('specialty')|| null
        c.keywords = request.input('keywords')|| null
        c.original_date = request.input('originalDate')|| null
        c.complexity = request.input('complexity')|| null
        c.published = request.input('published')|| 0

        const cv = new CaseVersion()
        cv.source = request.input('source')
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
        permission.save(trx)

        await c.save()

        trx.commit()

        return response.json(c)

      } else return response.status(500).json('case not found')
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
  async destroy ({ params, response }) {
    const trx = await Database.beginTransaction()
    try {
      const c = await Case.findBy('id', params.id)

      if (c != null) {
        await c.versions().delete()
        // await c.users().detach()
        // await c.quests().detach()
        await c.artifacts().delete()

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

  async share ({params, request, response}){
    const trx = await Database.beginTransaction()

    try {
      const entity = request.input('entity')
      const subject = request.input('subject')
      const clearance = request.input('clearance')
      const table_id = request.input('table_id').split(',')
      // console.log(entity)
      // console.log(subject)
      // console.log(clearance)
      // console.log(table_id)

      for (let c in table_id){
        // console.log('============ case for')
        console.log(table_id[c])
        if(await Case.findBy('id', table_id[c])){
          // console.log('================================================ case added')
          // console.log(table_id[c])
          let permission = new Permission()
          permission.id = await uuidv4()
          permission.entity = entity
          permission.subject = subject
          permission.clearance = clearance
          permission.table = 'cases'
          permission.table_id = table_id[c]
          await permission.save(trx)
        }else return response.json('Could not find the case id, please review and try again')
      }

      trx.commit()
      return response.json('Cases shared successfully!')
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(500).json({ message: e.message })
    }

  }

}

module.exports = CaseController
