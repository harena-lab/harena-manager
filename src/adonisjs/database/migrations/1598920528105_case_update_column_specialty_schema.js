'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseUpdateColumnSpecialtySchema extends Schema {
  up () {
    this.table('cases', (table) => {
      table.string('specialty', 512).alter()
    })
  }

  down () {
    this.table('cases', (table) => {
      table.string('specialty', 50).alter()
    })
  }
}

module.exports = CaseUpdateColumnSpecialtySchema
