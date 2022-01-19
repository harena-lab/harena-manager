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
      if(cs)
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

      const logger = await Database
        .select([
          'loggers.id',
          'loggers.user_id', 'users.username',
          'loggers.case_id', 'cases.title',
          'loggers.instance_id', 'loggers.log',
          'loggers.created_at'],
        )
        .from('loggers')
        .join('users', 'loggers.user_id','users.id')
        .join('cases', 'loggers.case_id', 'cases.id')
        .where('loggers.case_id', cs.id)
        .orderBy('users.username', 'asc')
        .orderBy('loggers.created_at', 'asc')

      return response.json({logs: logger})
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

}

module.exports = LoggerController