'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const uuidv4 = require('uuid/v4')

class Room extends Model {
  static get incrementing () {
    return false
  }

  users () {
    return this.belongsToMany('App/Models/v1/User')
      .pivotTable('room_users')
  }

  cases () {
    return this.belongsToMany('App/Models/v1/Case')
      .pivotTable('room_cases')
  }

  artifact () {
    return this.belongsTo('App/Models/v1/Artifact')
  }

  quest () {
    return this.belongsTo('App/Models/v1/Quest')
  }
}

module.exports = Room
