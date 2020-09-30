'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const Logger = use('Logger')

class CheckUserQuestPermission {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ params, request, auth, response }, next, properties) {
    // console.log('checking user permission...')
    try {
  		const userId = auth.user.id
  		const questId = request.input('questId')

      let query_result

      if (properties[0] == 'read') {
        query_result = await Database
          .from('quests_users')
          .where('quests_users.user_id', userId)
          .where('quests_users.quest_id', questId)
          .whereIn('quests_users.permission', ['read', 'share', 'write', 'delete'])
          .count()
      }

      if (properties[0] == 'share') {
        query_result = await Database
          .from('quests_users')
          .where('quests_users.user_id', userId)
          .where('quests_users.quest_id', questId)
          .whereIn('quests_users.permission', ['share', 'write', 'delete'])
          .count()
      }

      if (properties[0] == 'write') {
        query_result = await Database
          .from('quests_users')
          .where('quests_users.user_id', userId)
          .where('quests_users.quest_id', questId)
          .whereIn('quests_users.permission', ['write', 'delete'])
          .count()
      }

      if (properties[0] == 'delete') {
        query_result = await Database
          .from('quests_users')
          .where('quests_users.user_id', userId)
          .where('quests_users.quest_id', questId)
          .whereIn('quests_users.permission', ['delete'])
          .count()
      }

      if (query_result[0]['count(*)'] === 0) {
        return response.status(500).json('you dont have permission for such operation with the given quest')
      } else {
        await next()
      }
  	} catch (e) {
  		console.log(e)
      return response.status(500).json(e)
  	}
  }
}

module.exports = CheckUserQuestPermission
