'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/v1/User');
const CaseVersion = use('App/Models/v1/CaseVersion');

const uuidv4 = require('uuid/v4');

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
      let user = await User.find(params.id)

      if (user != null)
        return response.json(user)
      else return response.status(500).json('user nout found')
    } catch(e){
      console.log(e)
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
      let user = new User()

      user.id =  await uuidv4()
      user.username = request.input('username')
      user.email = request.input('email')
      user.password = request.input('password')
      user.login = request.input('login')
      await user.save()

      let token = await auth.generate(user)

      Object.assign(user, token)
      response.json(user)
    } catch (e) {
      console.log(e)
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

      if (storeduser != null){
        await storeduser.merge(newUser)
        await storeduser.save()
        return response.json(storeduser)
      } else return response.status(500).json('user not found')

    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  /** Delete a user with id.
   * DELETE user/:id */
  async destroy({ params, response, auth }) {
    try{
      let user = await User.find(params.id)

      if (user != null) {
        await user.delete()
      } else return response.json('user nout found')

      return response.json(user)
    }catch(e){
      return response.status(e.status).json({ message: e.message })
    }
  }

  async list_quests({ params, response }) {
    try{
      let user = await User.find(params.id)

      if (user != null) {
        return response.json(await user.contributes_with_quests().fetch())
      } else return response.status(500).json('user not found')
    } catch(e){
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  async list_cases({ params, response }) {
    try{
      let user = await User.find(params.id)
      console.log(user)

      if (user != null) {
        return response.json(await user.contributes_with_cases().fetch())
      } else return response.status(500).json('user not found')

// console.log('filter')
//         let user = await User.find(filter)
//         let cases = await user.contributes_with_cases().fetch()

//         for (var i = 0; i < cases.length; i++) {
//           cases[i].contributors = cases[i].contributors().fetch()
//         }

//         // cases.contributors = cases.contributors().fetch()
//         return response.json(cases)

    } catch(e){
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }
}

module.exports = UserController
