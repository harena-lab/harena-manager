'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RoomCase extends Model {
  static get incrementing () {
    return false
  }

  static get updatedAtColumn () {
    return null // disables updated_at
  }
}

module.exports = RoomCase
