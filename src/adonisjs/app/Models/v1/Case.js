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
  //
  // permissions () {
  //   return this.hasMany('App/Models/v1/Permission')
  // }

  author () {
    return this.belongsTo('App/Models/v1/User')
  }

  quests () {
    return this
      .belongsToMany('App/Models/v1/Quest')
      .pivotTable('quests_cases')
      .withPivot(['order_position'])
      .withTimestamps()
  }

  annotations () {
    return this
      .hasMany('App/Models/v1/CaseAnnotation', 'id', 'case_id')
  }

  institution () {
    return this.belongsTo('App/Models/v1/Institution')
  }
}

module.exports = Case
