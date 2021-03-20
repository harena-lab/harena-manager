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
      console.log('kokokok')
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
          .from('cases')
          .leftJoin('permissions', 'cases.id', 'permissions.table_id')
          .join('users', 'users.id', 'cases.author_id')
          .where('cases.author_id', auth.user.id)
          .orWhere(function () {
            this
              .where('permissions.entity', 'institution')
              .where('permissions.subject', auth.user.institution_id)
              .where('permissions.clearance', '>=', 1)
              .where(function(){
                this
                .whereNull('permissions.subject_grade')
                .orWhere('permissions.subject_grade', auth.user.grade)
              })
          })
          .count()
      }

      if (properties[0] == 'share') {
        queryResult = await Database
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .join('users', 'users.id', 'cases.author_id')
        .where('cases.author_id', auth.user.id)
        .orWhere(function () {
          this
            .where('permissions.entity', 'institution')
            .where('permissions.subject', auth.user.institution_id)
            .where('permissions.clearance', '>=', 2)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', auth.user.grade)
            })
        })
        .count()
      }

      if (properties[0] == 'write') {
        queryResult = await Database
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .join('users', 'users.id', 'cases.author_id')
        .where('cases.author_id', auth.user.id)
        .orWhere(function () {
          this
            .where('permissions.entity', 'institution')
            .where('permissions.subject', auth.user.institution_id)
            .where('permissions.clearance', '>=', 4)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', auth.user.grade)
            })
        })
        .count()
      }

      if (properties[0] == 'delete') {
        queryResult = await Database
          .from('cases')
          .join('users', 'users.id', 'cases.author_id')
          .where('cases.author_id', auth.user.id)
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
