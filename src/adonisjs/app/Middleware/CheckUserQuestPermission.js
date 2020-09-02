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
    try{
  		let userId = auth.user.id
  		let questId = request.input('questId')

      let query_result

      if (properties[0] == null){
        query_result = await Database
            .from('quests_users')
            .where('quests_users.user_id', userId)
            .where('quests_users.quest_id', questId)
            .count()
      }


      if (properties[0] == 'contributor'){
        query_result = await Database
            .from('quests_users')
            .where('quests_users.user_id', userId)
            .where('quests_users.quest_id', questId)
            .whereIn('quests_users.role', [0, 1])
            .count()
      }

      if (properties[0] == 'player'){
        query_result = await Database
            .from('quests_users')
            .where('quests_users.user_id', userId)
            .where('quests_users.quest_id', questId)
            .whereIn('quests_users.role', [2])
            .count()
      }

      if (query_result[0]['count(*)'] === 0)
        return response.status(500).json('user dont have ' + properties[0] + ' permissions for such quest or quest id is incorrect')
      else {
        // Logger.info('check user\'s quest permission - OK')
        await next()
      }
  	} catch(e){
  		console.log(e)
      return response.status(500).json(e)
  	}

  }
}

module.exports = CheckUserQuestPermission
