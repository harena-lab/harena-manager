'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const uuidv4 = require('uuid/v4')

class Quest extends Model {
  static get incrementing () {
    return false
  }

  users () {
    return this.belongsToMany('App/Models/v1/User')
      .pivotTable('quests_users')
      .withPivot(['permission'])
      .withTimestamps()
  }

  cases () {
    return this.belongsToMany('App/Models/v1/Case')
      .pivotTable('quests_cases')
      .withPivot(['order_position'])
      .withTimestamps()
  }

  artifact () {
    return this.belongsTo('App/Models/v1/Artifact')
  }

  annotations () {
    return this
      .hasMany('App/Models/v1/QuestAnnotation', 'id', 'quest_id')
  }
}

module.exports = Quest
