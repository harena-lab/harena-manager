'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const User = use('App/Models/v1/User');
const Case = use('App/Models/v1/Case');

class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view, auth }) {
    try{
      let users = await User.all()
      return response.json(users)
    } catch(e){
      return response.status(e.status).json({ message: e.message })
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    try{
      let users = await User.find(params.id)
      return response.json(users)
    } catch(e){
      return response.status(e.status).json({ message: e.message })
    }
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, auth, response }) {
    try {
      let user = await User.create(request.all())

      let token = await auth.generate(user)
      Object.assign(user, token)
      response.json(user)
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ message: e.message })
      }

      return response.status(e.status).json({ message: e.message })
    }
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, auth }) {
    try {
      let newUser = request.all()

      let storeduser = await User.find(params.id)

      await storeduser.merge(newUser)
      await storeduser.save()
     
      return response.json(storeduser)
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  /** Delete a user with id.
   * DELETE user/:id */
  async destroy({ params, response, auth }) {
    try{
      let user = await User.find(params.id)
      await user.delete()

      return response.json(user)
    }catch(e){
      return response.status(e.status).json({ message: e.message })
    }
  }

  /** List the cases authored by the user */
  async listCases({ params, response }) {
    try{
      let user = await User.find(params.id)
      let cases = await user.cases().fetch()
      // let result = await Database.select('title', 'description', 'cases.created_at').from('users').leftJoin('cases', 'users.id', 'cases.user_id')
      
      console.log(cases)
      return response.json(cases)
    } catch(e){
      console.log(e)
    }
  }

  async newExecution({ request, response }) {
    try {
      const {user_id, case_id} = request.post()
      let user = await User.find(user_id)
      let case1 = await Case.find(case_id)

      await user.executions().attach(case1.id)
      user.executions = await user.executions().fetch()
      console.log(user.executions())
      return response.json(user)
    } catch (e) {
      console.log(e)
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ message: e.message })
      }

      return response.status(e.status).json({ message: e.message })
    }
  }

  async listExecutions({ params, response, view }) {
    try{
      let user = await User.find(params.id)
      
      return response.json(await user.executions().fetch())
    } catch(e){
      console.log(e)
    }
  }

  
}

module.exports = UserController
