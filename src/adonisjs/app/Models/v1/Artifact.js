'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Artifact extends Model {
  static get incrementing () {
    return false
  }

  user () {
    return this.belongsTo('App/Models/v1/User')
  }
}

module.exports = Artifact
