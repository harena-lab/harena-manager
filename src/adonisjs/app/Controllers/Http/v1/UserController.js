'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/v1/User');
const CaseVersion = use('App/Models/v1/CaseVersion');

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
      return response.json(cases)
    } catch(e){
      console.log(e)
    }
  }

  async newExecution({ request, response }) {
    try {
      const {user_id, case_version_id} = request.post()
      let user = await User.find(user_id)
      let cv = await CaseVersion.find(case_version_id)

      await user.executions().attach(cv.id)
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

  async available_cases({ params, response, view }) {
    try{
      let user = await User.find(params.id)

      return response.json(await user.available_cases().fetch())
    } catch(e){
      console.log(e)
    }
  }

  async enable_case({ request, response }) {
    try {
      const {user_id, case_version_id, flow} = request.post()
      let user = await User.find(user_id)
      let cv = await CaseVersion.find(case_version_id)

      user.flow = flow
      await user.available_cases().attach(cv.id)
      user.available_cases = await user.available_cases().fetch()
      return response.json(user)
    } catch (e) {
      console.log(e)
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({message: e.message})
      }

      return response.status(e.status).json({message: e.message})
    }
  }

  
}

module.exports = UserController
