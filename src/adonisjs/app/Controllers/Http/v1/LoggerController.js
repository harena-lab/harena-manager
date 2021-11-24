'use strict'

const Database = use('Database')

const User = use('App/Models/v1/User')
const Case = use('App/Models/v1/Case')
const Logger = use('App/Models/v1/Logger')

const uuidv4 = require('uuid/v4')

class LoggerController {
  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const logger = new Logger()
      const user = await User.find(auth.user.id)
      const cs = await Case.find(request.input('caseId'))

		  logger.id = await uuidv4()
      logger.user_id = user.id
      logger.case_id = cs.id
      logger.instance_id = request.input('instanceId')
      logger.log = request.input('log')

		  await logger.save(trx)
      trx.commit()

		  response.json('logger successfully created')
	  } catch (e) {
      trx.rollback()
    	console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  async listLogger ({ request, response }) {
    try {
      const cs = await Case.find(request.input('caseId'))

      const logger = await Logger
        .query()
        .where('case_id', cs.id)
        .fetch()

      return response.json({logs: logger})
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

}

module.exports = LoggerController
