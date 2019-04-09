'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Case = use('App/Models/v1/Case');
const Drive = use('Drive');

const uuidv1 = require('uuid/v1');
var dateFormat = require('dateformat');

const DIR_CASES = "../../../cases/";


const FILE_CASE_NAME = "case";
const FILE_CASE_EXTENSION = ".md";
const FILE_CASE = FILE_CASE_NAME + FILE_CASE_EXTENSION;

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
      let caseText = request.input('caseText')
      let caseName = request.input('caseName')

      let caseDir = DIR_CASES + caseName + "/"
      let caseFile = caseDir + FILE_CASE;
      let versionsDir = caseDir + "version/"

      // copy a version of the previous file
      let versionFile = "new file"
      if (await Drive.exists(caseFile)) {
        let currentTime = dateFormat(new Date().getTime(), "_yyyy-mm-dd-h-MM-ss_");
        versionFile = FILE_CASE_NAME + currentTime + uuidv1() + FILE_CASE_EXTENSION
        await Drive.copy(caseFile, versionsDir + versionFile)
      }

      const c = new Case()
      c.caseName = caseName
      c.caseText = JSON.stringify(caseText)
      c.user_id = auth.user.id

      const file = DIR_CASES + caseName + '/case.md';

      await Drive.put(file, Buffer.from(caseText))
      
      c.url = file

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
