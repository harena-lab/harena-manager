'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Ticket extends Model {
  static get createdAtColumn () {
    return null // disables updated_at
  }

  static get updatedAtColumn () {
    return null // disables updated_at
  }
}

module.exports = Ticket
