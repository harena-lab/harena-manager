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
      let cases = await Case.all()
      return response.json(cases)
    } catch(e){
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
  async update({ params, request, response, auth }) {
    try {
      let logged_user = auth.user.id

      // verify if the loged user is contributor of the given case
      let sqlQuery = 'select cc.user_id from users u ' +
                        'left join case_contributors cc on u.id = cc.user_id ' +
                        'where cc.user_id = ? and cc.case_id = ? and cc.role = 1'
      let contributor = await Database.raw(sqlQuery, [logged_user, params.id])

      if (contributor == null)
        return response.status(500).json('you are not contributor of this case')


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
  async destroy({ params, response, auth }) {
    const trx = await Database.beginTransaction()

    try {
      let logged_user = auth.user.id

      // verify if the loged user is owner of the case
      let sqlQuery = 'select cc.user_id from users u ' +
                        'left join case_contributors cc on u.id = cc.user_id ' +
                        'where cc.user_id = ? and cc.case_id = ? and cc.role = 0'
      let author = await Database.raw(sqlQuery, [logged_user, params.id])

      if (author == null)
        return response.status(500).json('you are not owner of this case')

      let c = await Case.findBy('id', params.id)
      
      if (c != null){
        let versions = await c.versions().fetch()
        let versions_rows = versions.rows

        for (let i = 0; i < versions_rows.length; i++) {
          let cv = await CaseVersion.findBy('id', versions_rows[i].id)
          cv.delete()
        }

        let contributors = await c.contributors().fetch()
        let contributors_rows = contributors.rows
        let contributors_ids = []

        for (let i = 0; i < contributors_rows.length; i++) {
          contributors_ids.push(contributors_rows[i].id)
        }

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
      let logged_user = auth.user.id
      let {user_id, case_id} = request.post()

      if (logged_user == user_id){
        return response.status(500).json('cannot share a case with herself')
      }

      // get cases in which logged_user is author of
      let sqlQuery = 'select cc.case_id from users u ' +
                        'left join case_contributors cc on u.id = cc.user_id ' +
                        'where cc.user_id = ? and cc.case_id = ? and cc.role = 0'
      let owned_cases = await Database.raw(sqlQuery, [logged_user, case_id])

      console.log(owned_cases)
      if (owned_cases[0] == undefined ){
        return response.status(500).json('you are not owner of this case')
      }

      let user = await User.find(user_id)

      await user.contributes_with_cases().attach(case_id, (row) => {
        row.role = 1
      })

      return response.json('case successfully shared')

    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }
}

module.exports = CaseController
