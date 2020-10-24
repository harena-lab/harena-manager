'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Case extends Model {
  static get incrementing () {
    return false
  }

  versions () {
    return this.hasMany('App/Models/v1/CaseVersion')
  }

  artifacts () {
    return this.hasMany('App/Models/CaseArtifact')
  }

  permissions () {
    return this.hasMany('App/Models/v1/Permission')
  }

  users () {
    return this.belongsToMany('App/Models/v1/User')
      .pivotTable('users_cases')
      .withPivot(['permission'])
      .withTimestamps()
  }

  quests () {
    return this
      .belongsToMany('App/Models/v1/Quest')
      .pivotTable('quests_cases')
      .withPivot(['order_position'])
      .withTimestamps()
  }

  institution () {
    return this.belongsTo('App/Models/v1/Institution')
  }
}

module.exports = Case
