'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/v1/User');
const Case = use('App/Models/v1/Case');
const CaseVersion = use('App/Models/v1/CaseVersion')
const JavaScript = use('App/Models/v1/JavaScript')

const fs = require('fs');
const fse = require('fs-extra')
const path = require('path');

var dateFormat = require('dateformat');

const DIR_MODELS = "../../models/"
const DIR_CASES = "../../cases/";
const FILE_CASE_NAME = "case";
const FILE_CASE_EXTENSION = ".md";
const FILE_CASE = FILE_CASE_NAME + FILE_CASE_EXTENSION;

let BLANK_MODEL = "blank"
let TEMPORARY_CASE = "_temporary"

const PLAYER_DIR = "../../player/"
const FILE_PLAYER = "index.html"
const INFRA_DIR = "../../infra/"
/**
 * Resourceful controller for interacting with cases
 */
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
        let user = await User.findBy('id', request.input('filter'))
        let cases = await user.cases().fetch()
        return response.json(cases)
      }
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
      let versions = await c.versions().fetch()
      console.log(versions.first())
      return response.json({ 'caseMd': versions.first().md })
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
      c.name = caseName
      c.user_id = auth.user.id
      
      let cv = new CaseVersion()
      cv.md = caseText
      
      await c.versions().save(cv)
      let versions = await c.versions().fetch()

      return response.json({ "versionFile": versions.first().uuid })
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }

  /** * Update case details. PUT or PATCH case/:id */
  async update({ params, request, response }) {
    try {
      let c = await Case.find(params.id)

      c.name = request.input('caseName')

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

  async prepareCaseHTML({ params, request, response }) {
    try {
      let c = await Case.find(params.id)

      // copy the player and its scripts to the case
      // let indexFile = fs.readFileSync(PLAYER_DIR + 'index.html', "utf8")
      // let htmlFile = await Factory.model('App/Models/v1/HtmlFile').make({ name: 'index.html', content: indexFile })

      let jsPlayerFiles = fs.readdirSync(PLAYER_DIR + "js")

      let jss = []
      
      for (let j = 0; j < jsPlayerFiles.length; j++) {
        let js = { name: jsPlayerFiles[j], content: fs.readFileSync(PLAYER_DIR + "js/" + jsPlayerFiles[j], 'utf8') }
        jss.push(js)
        // await c.javascripts().make(jsd)
      } 
      Object.assign(c, { player: jss })
      return c


      // await c.htmlFiles().save(htmlFile)

      // copy bus scripts to the case 
      // let jsInfraFiles = fs.readdirSync(INFRA_DIR)
    
      // jsInfraFiles = jsInfraFiles.filter(function(file) {
      //   return path.extname(file).toLowerCase() === ".js";
      // });

      // for (let j = 0; j < jsInfraFiles.length; j++) {
      //   let js = await Factory.model('App/Models/v1/JavaScript').make({ name: jsInfraFiles[j], content: fs.readFileSync(INFRA_DIR + jsInfraFiles[j], 'utf8') })
      //   // await c.javascripts().save(js)
      // }
      return response.json({ status: 'ok' })
    } catch (e) {
      console.log(e)
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ status: 'duplicate' })
      }
      return response.status(e.status).json({ message: e.message })
    }
  }

  
}

module.exports = CaseController
