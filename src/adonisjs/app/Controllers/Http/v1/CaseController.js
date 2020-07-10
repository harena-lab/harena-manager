'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const User = use('App/Models/v1/User');
const Case = use('App/Models/v1/Case');
const CaseVersion = use('App/Models/v1/CaseVersion')

const uuidv4 = require('uuid/v4');

/** * Resourceful controller for interacting with cases */
class CaseController {
  /** Show a list of all cases */
  async index({ request, response, }) {
    try {

      let filterBy = request.get().filterBy
      let filter = request.get().filter

      if (filterBy == null){
        // let cases = await Case.query().with('versions').fetch()
        let cases = await Case.all()

        return response.json(cases)
      }

      if (filterBy == 'user'){
        let user = await User.find(filter)
        let cases = await user.contributes_with_cases().fetch()

        return response.json(cases)
      }
    } catch (e) {
      console.log(e)
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
  async show({ params, response }) {
    try {

      let c = await Case.find( params.id )

      if (c != null){
        let versions = await CaseVersion.query().where('case_id', '=', params.id ).orderBy('created_at', 'asc').fetch()

        c.source = versions.last().source
        c.versions = versions
        return response.json(c)
      } else return response.status(500).json('case not found')
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  /**  * Create/save a new case.*/
  async store({ request, auth, response }) {
    try {

      let c = await Case.findBy('title', request.input('title'))

      if (c == null) {
        c = new Case()
        c.id = await uuidv4()
        c.title = request.input('title')
        c.description = request.input('description')
        c.language = request.input('language')
        c.domain = request.input('domain')
        c.specialty = request.input('specialty')
        c.keywords = request.input('keywords')


        let cv = new CaseVersion()
        cv.id = await uuidv4()
        cv.source = request.input('source')

        await c.versions().save(cv)
        await c.contributors().attach(auth.user.id, (row) => {
          row.role = 0
        })

        c.versions = await c.versions().fetch()
        c.contributors = await c.contributors().fetch()
        return response.json(c)

      } else return response.status(500).json('title already exists')

    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  /** * Update case details. PUT or PATCH case/:id */
  async update({ params, request, response }) {
    try {
      let c = await Case.find(params.id)

      if (c != null){
        c.title = request.input('title')
        c.description = request.input('description')
        c.language = request.input('language')
        c.domain = request.input('domain')
        c.specialty = request.input('specialty')
        c.keywords = request.input('keywords')
        
        let cv = new CaseVersion()
        cv.source = request.input('source')
        cv.id = await uuidv4()

        await c.versions().save(cv)
        await c.save() 
        return response.json(c)
      } else return response.status(500).json('case not found')

    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
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
  async destroy({ params, response }) {
    const trx = await Database.beginTransaction()

    try {
      let c = await Case.findBy('id', params.id)
      
        if (c != null){
                let versions = await c.versions().fetch()
        let cvs = versions.rows
        // let case_versions = []

        for (let i = 0; i < cvs.length; i++) {
          let cv = await CaseVersion.findBy('id', cvs[i].id)
          cv.delete()
          // case_versions.push(cvs[i].id)
        }

        let contributors = await c.contributors().fetch()
        let contributors_int = contributors.rows
        let contributors_ids = []

        for (let i = 0; i < contributors_int.length; i++) {
          contributors_ids.push(contributors_int[i].id)
        }

        // await c.versions().detach(case_versions)
        await c.contributors().detach(contributors_ids)


        c.delete()

        trx.commit()
        return response.json(c)
      } else return response.status(500).json('case not found')

    } catch (e) {
      console.log(e)
      trx.rollback()
      return response.status(500).json({ message: e.message })
    }
  }

  async share({ request, auth, response }) {
    try {
      let loggedUser = auth.user.id
      let {user_id, case_id} = request.post()

      let sqlQuery = 'select c.user_id, c.case_id from users u ' +
                        'left join contributors c on u.id = c.user_id ' +
                        'where c.user_id = ? and c.case_id = ?'
      let contributors = await Database.raw(sqlQuery, [loggedUser, case_id])

      if (contributors[0] == undefined){
        return response.json('You are not allowed to share this case.')
      }

      let user = await User.find(user_id)

      await user.cases().attach(case_id, (row) => {
        row.author = false
      })

      return response.json(contributors[0])
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }
}

module.exports = CaseController
