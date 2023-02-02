'use strict'

const Database = use('Database')

const User = use('App/Models/v1/User')
const Case = use('App/Models/v1/Case')
const Logger = use('App/Models/v1/Logger')
const Institution = use('App/Models/v1/Institution')

const uuidv4 = require('uuid/v4')

class LoggerController {
  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const logger = new Logger()
      const user = await User.find(auth.user.id)
      const cs = await Case.find(request.input('caseId')) ||
                 await Case.findBy('title', request.input('caseId'))

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

  async listLogger ({request, response}) {
    try {
      let logger = null

      const req = request.all()

      let cs = null, institution = null
      if (req.caseId != null) {
        cs =  await Case.find(req.caseId) ||
                    await Case.findBy('title', req.caseId)
      } else if (req.institutionId != null) {
        institution =
          await Institution.find(req.institutionId) ||
          await Institution.findBy('acronym', req.institutionId)
      }

      if (cs != null || institution != null)
        logger = await Database
          .select([
            'loggers.id', 'loggers.user_id', 'users.username', 'loggers.case_id',
            'loggers.instance_id', 'loggers.log', 'loggers.created_at'
           ])
          .from('loggers')
          .join('users', 'loggers.user_id', 'users.id')
          .modify(function() {
              if (cs != null) this.where('loggers.case_id', cs.id)
           })
          .modify(function() {
              if (institution != null)
                this.where('users.institution_id', institution.id)
           })
          .modify(function(){
              if (req.startingDateTime != null &&
                  req.startingDateTime.length > 0)
                this.where('loggers.created_at', '>=', req.startingDateTime)
           })
           .modify(function(){
               if (req.endingDateTime != null && req.endingDateTime.length > 0)
                 this.where('loggers.created_at', '<=', req.endingDateTime)
            })
          .orderBy('users.username', 'asc')
          .orderBy('loggers.created_at', 'asc')

      return response.json({logs: logger})
    } catch (e) {
      console.log(e)
      return response.status(500).json({message: e.message})
    }
  }

}

module.exports = LoggerController
