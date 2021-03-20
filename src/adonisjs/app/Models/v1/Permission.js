'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Permission extends Model {
  static get incrementing () {
    return false
  }

  environment () {
    return this.belongsTo('App/Models/Environment')
  }
}

module.exports = Permission
