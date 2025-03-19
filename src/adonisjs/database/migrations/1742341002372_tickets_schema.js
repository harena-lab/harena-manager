'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TicketSchema extends Schema {
  up () {
    this.create('tickets', (table) => {
      table.increments()
    })
  }

  down () {
    this.drop('tickets')
  }
}

module.exports = TicketSchema
