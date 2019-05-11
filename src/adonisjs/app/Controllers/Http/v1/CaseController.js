'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/v1/User');
const Case = use('App/Models/v1/Case');
const CaseVersion = use('App/Models/v1/CaseVersion')

const fs = require('fs');

const PLAYER_DIR = "../../player/"

/** * Resourceful controller for interacting with cases */
class CaseController {
  /** Show a list of all cases */
  async index({ request, response }) {
    try {
      let filterBy = request.input('filterBy')
      if (filterBy == null){
        let cases = await Case.query().with('versions').fetch()
        return response.json(cases)
      }
      if (filterBy == 'user'){
        let user = await User.find(request.input('filter'))
        let cases = await user.cases().fetch()
        return response.json(cases)
      }
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.message })
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
      let versions = await c.versions().fetch()

      c.source = versions.first().source

      return response.json(c)
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  /**  * Create/save a new case.*/
  async store({ request, auth, response }) {
    try {
      let c = new Case()
      c.name = request.input('name')
      c.user_id = auth.user.id
      
      let cv = new CaseVersion()
      cv.source = request.input('source')
      
      await c.versions().save(cv)
      await c.versions().fetch()

      return response.json(c)
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }

  /** * Update case details. PUT or PATCH case/:id */
  async update({ params, request, response }) {
    try {
      let c = await Case.find(params.id)

      c.name = request.input('name')
      
      let cv = new CaseVersion()
      cv.source = request.input('source')

      await c.versions().save(cv)
      await c.save() 
      return response.json(c)
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.message })
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
    try {
      await Case.find(params.id).delete()
      return response.json({ message: 'Case deleted!' })
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  async newCase({ response, auth }) {
    try {
      let c = new Case()
      c.user_id = auth.user.id
      
      await c.save()
      return response.json(c)
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }
}

module.exports = CaseController
