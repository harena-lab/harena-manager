'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Group extends Model {
  static get incrementing () {
    return false
  }

  users () {
    return this.belongsToMany('App/Models/v1/User')
      .pivotTable('users_groups')
      .withTimestamps()
  }

}

module.exports = Group
