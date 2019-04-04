'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Case = use('App/Models/v1/Case');

/**
 * Resourceful controller for interacting with cases
 */
class CaseController {
  /**
   * Show a list of all cases.
   * GET cases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    try {
      let cases = await Case.query().with('user').fetch()
      return response.json(cases)
    } catch (e) {
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
  async show({ params, request, response, view }) {
    try {
      let c = await Case.find(params.id)
      return response.json(c)
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }
  /**
   * Create/save a new case.
   * POST cases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, auth, response }) {
    try {
      const c = new Case()
      c.title = request.input('title')
      c.description = request.input('description')
      c.user_id = auth.user.id
      await c.save()
      return response.json(c)
    } catch (e) {
      return response.status(e.status).json({ message: e.message })

    }
  }

  /**
   * Update case details.
   * PUT or PATCH cases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      let c = await Case.find(params.id)

      c.title = request.input('title')
      c.description = request.input('description')

      await c.save()
      return response.json(c)
    } catch (e) {
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
  async destroy({ params, request, response }) {
    try {
      await Case.find(params.id).delete()
      return response.json({ message: 'Case deleted!' })
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }
}

module.exports = CaseController
