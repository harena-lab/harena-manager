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
console.log(2)
    try{
	    let logged_user = auth.user.id
		let sqlQuery = ""
		let case_id = ""

		if (Object.keys(params).length === 0){
			case_id = request.input('case_id')
		} else {
			case_id = params.id
		}
    	
    	// verify if the loged user is owner of the case
	    if (properties[0] == 'author'){
		    
		    sqlQuery = 'select uc.user_id from users u ' +
		                      'left join users_cases uc on u.id = uc.user_id ' +
		                      'where uc.user_id = ? and uc.case_id = ? and uc.role = 0'
		    let author = await Database.raw(sqlQuery, [logged_user, case_id])

		    if (author != null)
		      	await next()
			else return response.status(500).json('you are not owner of this case')
	    }

		if (properties[0] == 'contributor'){

			let logged_user = auth.user.id

		    // verify if the loged user is a contributor of the given case
		    sqlQuery = 'select uc.user_id from users u ' +
			                        'left join users_cases uc on u.id = uc.user_id ' +
			                        'where uc.user_id = ? and uc.case_id = ? and (uc.role = 1 or uc.role = 0)'
		    let contributor = await Database.raw(sqlQuery, [logged_user, case_id])

		    if (contributor != null)
			    await next()
			else return response.status(500).json('you are not contributor of this case')
		}
    }catch(e){
    	console.log('quebrou')
    	console.log(e)
    	return response.status(500).json( e )
    }
    
  }
}

module.exports = CheckPermissionForGivenCase
