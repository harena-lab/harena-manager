'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      table.string('image_url').nullable()
      // alter table
    })
  }

  down () {
    this.table('cases', (table) => {
      // reverse alternations
      table.dropColumn('image_url')
    })
  }
}

module.exports = CaseSchema
