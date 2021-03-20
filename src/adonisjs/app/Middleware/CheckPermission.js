'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

class CheckPermission {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ params, request, response, auth }, next, properties) {
    try {
      let resourceId = params.id
      if (resourceId == undefined){
        resourceId = request.input('caseId')
      }
      const user = await auth.user
      const resource = properties[0]
      const clearance = properties[1]
      // console.log(user.environment_id)
      const environment =  await user.environment
      // const environment =  await user.environment().fetch()

      // c.versions = await c.versions().fetch()
      console.log('clearance: '+clearance  )
      console.log('resource: '+resource)
      console.log('resourceId: '+resourceId)
      console.log('environment: '+user.environment_id)

      let queryResult
      const clearances = ['read', 'comment', 'share', 'write', 'delete']
      const clearanceIindex = clearances.indexOf(clearance)
      // console.log('clearance '+ clearanceIindex)

      queryResult = await Database
        .from('permissions')
        .leftJoin('environments', 'environments.id', 'permissions.environment_id')
        // .where('environments.id', environment.id)

        .leftJoin('users', 'users.environment_id', 'environments.id')
        .where('users.environment_id', user.environment_id)
        .where('permissions.clearance',  '>=', clearanceIindex)
        .where('permissions.resource',  resource)
        .where('permissions.resource_id',  resourceId)
        .count()

      console.log('queryResult '+queryResult[0]['count(*)'])
      if (queryResult[0]['count(*)'] === 0) {
        return response.status(500).json('you dont have permission to ' + clearance + ' such ' + resource)
      } else {
        await next()
      }

    } catch (e) {
    	console.log(e)
    	return response.status(500).json(e)
    }
  }
}

module.exports = CheckPermission
