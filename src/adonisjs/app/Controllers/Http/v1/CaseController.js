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
        let versions = await CaseVersion.query()
                                          .where('case_id', '=', params.id )
                                          .orderBy('created_at', 'asc')
                                          .fetch()

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
      // let c = await Case.findBy('title', request.input('title'))

      // if (c == null) {
      let c = new Case()
      c.id = await uuidv4()
      c.title = request.input('title')
      c.description = request.input('description')
      c.language = request.input('language')
      c.domain = request.input('domain')
      c.specialty = request.input('specialty')
      c.keywords = request.input('keywords')
      c.original_date = request.input('original_date')

      let cv = new CaseVersion()
      cv.id = await uuidv4()
      cv.source = request.input('source')

      await c.versions().save(cv)
      await c.users().attach(auth.user.id, (row) => {
        row.role = 0
      })

      c.versions = await c.versions().fetch()
      c.users = await c.users().fetch()
      return response.json(c)
     // } else return response.status(500).json('title already exists')

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
         c.original_date = request.input('originalDate')
 
         let cv = new CaseVersion()
         cv.source = request.input('source')
         cv.id = await uuidv4()
         await c.versions().save(cv)
         await c.save() 
         return response.json(c)
       } else return response.status(500).json('case not found')

    } catch (e) {
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
  async destroy({ params, response }) {
    const trx = await Database.beginTransaction()
    try {

      let c = await Case.findBy('id', params.id)
      
      if (c != null){
        await c.versions().delete()
        await c.users().detach()
        await c.quests().detach()
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

  async share({ request, auth, response }) {  
    try {
      let logged_user = auth.user.id
      let {user_id, case_id} = request.post()

      if (logged_user == user_id){
        return response.status(500).json('cannot share a case with herself')
      }

      let user = await User.find(user_id)

      // Check if target user is an author
      let sql_return = await Database
        .select('slug')
        .from('roles')
        .where('slug', '=', 'author')
        .leftJoin('role_user', 'roles.id', 'role_user.role_id')
        .where('role_user.user_id', '=' , user_id)

      if (sql_return[0] != undefined){
        await user.cases().attach(case_id, (row) => {
          row.role = 1
        })
        return response.json('case successfully shared')

      } else {
        return response.status(500).json('target user is not an author')
      }


    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }
}

module.exports = CaseController
