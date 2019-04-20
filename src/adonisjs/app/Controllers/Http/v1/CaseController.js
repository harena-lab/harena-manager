'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Case = use('App/Models/v1/Case');
const CaseVersion = use('App/Models/v1/CaseVersion')
const Drive = use('Drive');

const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');

const fs = require('fs');
const fse = require('fs-extra')

var dateFormat = require('dateformat');

const DIR_MODELS = "../../models/"
const DIR_CASES = "../../cases/";
const FILE_CASE_NAME = "case";
const FILE_CASE_EXTENSION = ".md";
const FILE_CASE = FILE_CASE_NAME + FILE_CASE_EXTENSION;

let BLANK_MODEL = "blank"
let TEMPORARY_CASE = "_temporary"

const DIR_PLAYER = "../../../harena-space/player/"
const FILE_PLAYER = "index.html"
const DIR_INFRA = "../infra/"
/**
 * Resourceful controller for interacting with cases
 */
class CaseController {
  /** Show a list of all cases */
  async index({ response }) {
    try {
      let cases = await Case.query().with('versions').fetch()
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

  async loadCase({ params, response }) {
    try {
      let c = await Case.find( params.id )
      console.log(c)
      let versions = await c.versions().fetch()
      console.log(versions.first())
      return response.json({ 'caseMd': versions.first().caseText })
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  /**  * Create/save a new case.*/
  async store({ request, auth, response }) {
    try {
      let caseText = request.input('caseText')
      let caseName = request.input('caseName')

      let c = new Case()
      c.caseName = caseName
      c.user_id = auth.user.id
      
      let cv = new CaseVersion()
      cv.primaryKeyValue = await uuidv4()
      cv.caseText = JSON.stringify(caseText)
      
      await c.versions().save(cv)
      let versions = await c.versions().fetch()

      return response.json({ "versionFile": versions.first().id })
    } catch (e) {
      console.log(e)
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
      fse.copySync(DIR_MODELS + BLANK_MODEL, temporaryCase)
      return response.json({ caseName: TEMPORARY_CASE })
    } catch (e) {
      console.log(e)
    }
  }

  async renameCase({ params, request, response }) {
    try {
      let oldName = request.input('oldName')
      let newName = request.input('newName')

      let c = await Case.findBy('caseName', oldName)

      let oldDir = c.url
      let newDir = DIR_CASES + newName

      c.caseName = newName

      fs.accessSync(oldDir, fs.constants.R_OK | fs.constants.W_OK);
      fs.renameSync(oldDir, newDir)
      
      await c.save()
      return response.json({ status: 'ok' })
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ status: 'duplicate' })
      }
      return response.status(e.status).json({ message: e.message })
    }
  }

  async prepareCaseHTML({ params, request, response }) {
    try {
      let templateFamily = request.input('templateFamily')
      let caseName = request.input('caseName')

      fs.accessSync(DIR_CASES + "html", fs.constants.R_OK | fs.constants.W_OK);
      fs.renameSync(oldDir, newDir)
      
      fs.access(DIR_CASES + "html/knots", fs.constants.F_OK, (err) => {
        if (err) fs.mkdirSync(DIR_CASES + "html", { recursive: true })
      });
     
      
      fse.copySync(DIR_PLAYER + FILE_PLAYER, caseDir + "html")
      fse.copySync(DIR_PLAYER + "js", caseDir + "html")
      
      let busFiles = fs.readdirSync(DIR_INFRA+'js');
      busFiles.array.forEach(element => {
        fse.copySync(element, caseDir + "js")
      });

      return response.json({ status: 'ok' })
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ status: 'duplicate' })
      }
      return response.status(e.status).json({ message: e.message })
    }
  }
  
}

module.exports = CaseController
