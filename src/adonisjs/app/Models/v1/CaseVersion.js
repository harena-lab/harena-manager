'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CaseVersion extends Model {
  static get incrementing () {
    return false
  }

  case () {
    return this.belongsTo('App/Models/v1/Case')
  }

  executions () {
    return this.belongsToMany('App/Models/v1/User').pivotTable('executions').withTimestamps()
  }

  suggested_to () {
    return this.belongsToMany('App/Models/v1/User').pivotTable('suggestions').withTimestamps()
  }
}

module.exports = CaseVersion
