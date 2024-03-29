'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RoleUser extends Model {
  static get table () {
    return 'role_user'
  }
  static get incrementing () {
    return false
  }
}

module.exports = RoleUser
