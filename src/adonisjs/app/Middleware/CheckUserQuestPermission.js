'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

class CheckUserQuestPermission {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ params, request, auth }, next) {
  	try{
  		let user_id = auth.user.id
  		let quest_id = request.input('quest_id')

  		let query_result = await Database
  	        .from('quests_users')
  	        .where('quests_users.user_id', user_id)
            .where('quests_users.quest_id', quest_id)
  	        .whereIn('quests_users.role', [0, 1])
            .count()

      if (query_result[0]['count(*)'] === 0)
        return response.status(500).json('user dont have permission for such quest')
      else await next()

  	} catch(e){
  		console.log(e)
  	}
  	
  }
}

module.exports = CheckUserQuestPermission
