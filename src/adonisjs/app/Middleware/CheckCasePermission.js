'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

class CheckPermissionForGivenCase {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ params, request, response, auth }, next, properties) {
    try {
	    const loggedUserId = auth.user.id
      let sqlQuery = ''
      let caseId = ''

      let queryResult

      if (Object.keys(params).length === 0) {
        caseId = request.input('caseId')
      } else {
        caseId = params.id
      }

      if (properties[0] == 'read') {
        queryResult = await Database
          .from('users_cases')
          .where('users_cases.user_id', loggedUserId)
          .where('users_cases.case_id', caseId)
          .whereIn('users_cases.permission', ['read', 'share', 'write', 'delete'])
          .count()
      }

      if (properties[0] == 'share') {
        queryResult = await Database
          .from('users_cases')
          .where('users_cases.user_id', loggedUserId)
          .where('users_cases.case_id', caseId)
          .whereIn('users_cases.permission', ['share', 'write', 'delete'])
          .count()
      }

      if (properties[0] == 'write') {
        queryResult = await Database
          .from('users_cases')
          .where('users_cases.user_id', loggedUserId)
          .where('users_cases.case_id', caseId)
          .whereIn('users_cases.permission', ['write', 'delete'])
          .count()
      }

      if (properties[0] == 'delete') {
        queryResult = await Database
          .from('users_cases')
          .where('users_cases.user_id', loggedUserId)
          .where('users_cases.case_id', caseId)
          .whereIn('users_cases.permission', ['delete'])
          .count()
      }

      if (queryResult[0]['count(*)'] === 0) {
        return response.status(500).json('you dont have permission to ' + properties[0] + ' such case')
      } else {
        await next()
      }

    } catch (e) {
    	console.log(e)
    	return response.status(500).json(e)
    }
  }
}

module.exports = CheckPermissionForGivenCase
