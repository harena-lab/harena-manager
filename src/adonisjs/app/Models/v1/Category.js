'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  static get incrementing () {
    return false
  }

  cases () {
    return this.hasMany('App/Models/v1/Case')
  }

  artifact () {
    return this.belongsTo('App/Models/v1/Artifact')
  }
}

module.exports = Category
