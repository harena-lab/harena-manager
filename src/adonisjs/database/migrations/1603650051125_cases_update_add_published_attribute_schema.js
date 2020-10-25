'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CasesUpdateAddPublishedAttributeSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      // alter table
      table.boolean('published')
    })
  }

  down () {
    this.table('cases', (table) => {
      // reverse alternations
      table.dropColumn('published')
    })
  }
}

module.exports = CasesUpdateAddPublishedAttributeSchema
