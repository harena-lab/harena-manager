'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Case = use('App/Models/v1/Case');
const Drive = use('Drive');

const uuidv1 = require('uuid/v1');
const fs = require('fs');

var dateFormat = require('dateformat');

const DIR_MODELS = "../../../models/"
const DIR_CASES = "../../cases/";
const FILE_CASE_NAME = "case";
const FILE_CASE_EXTENSION = ".md";
const FILE_CASE = FILE_CASE_NAME + FILE_CASE_EXTENSION;

let BLANK_MODEL = "blank"
let TEMPORARY_CASE = "_temporary"

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
  async index({ response }) {
    try {
      console.log('index')
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
  async show({ params, response }) {
    try {
      let c = await Case.find(params.id)
      return response.json(c)
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  async loadCase({ request, response }) {
    try {
      let c = await Case.findBy('caseName', request.input('caseName'))
      return response.json({ 'caseMd': c.caseText })
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

      fs.access(caseDir, fs.constants.F_OK, (err) => {
        if (err) fs.mkdirSync(caseDir, { recursive: true })
        
        fs.writeFileSync(caseFile, caseText)

        let currentTime = dateFormat(new Date().getTime(), "_yyyy-mm-dd-h-MM-ss_");
        versionFile = FILE_CASE_NAME + currentTime + uuidv1() + FILE_CASE_EXTENSION
        fs.mkdirSync(versionsDir, { recursive: true })

        fs.copyFileSync(caseFile, versionsDir + versionFile);
      });

      let c = new Case()
      c.caseName = caseName
      c.caseText = JSON.stringify(caseText)
      c.user_id = auth.user.id
      c.url = caseDir

      await c.save()
      return response.json({ "versionFile": versionFile })
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

      c.caseName = request.input('caseName')
      console.log(c.caseName)
      c.caseText = request.input('caseText')

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
  async destroy({ params, response }) {
    try {
      await Case.find(params.id).delete()
      return response.json({ message: 'Case deleted!' })
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  async newCase({ response }) {
    try {
      let temporaryCase = DIR_CASES + TEMPORARY_CASE
      await Drive.copy(DIR_MODELS + BLANK_MODEL, temporaryCase)
      return response.json({ caseName: TEMPORARY_CASE })
    } catch (e) {
      console.log(e)
    }
  }

  async renameCase({ params, request, response }) {
    console.log('aqui')
    try {
      let oldName = request.input('oldName')
      let newName = request.input('newName')

      let c = await Case.findBy('caseName', oldName)

      console.log('hdauisd')

      let oldDir = c.url
      let newDir = DIR_CASES + newName
      console.log('fff')

      c.caseName = newName

      fs.accessSync(oldDir, fs.constants.R_OK | fs.constants.W_OK);
      fs.rename(oldDir, newDir)
      
      await c.save()
      return response.json({ status: 'ok' })
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ status: 'duplicate' })
      }
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }
}

module.exports = CaseController
