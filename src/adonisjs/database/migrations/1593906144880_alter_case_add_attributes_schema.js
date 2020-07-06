'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterCaseAddAttributesSchema extends Schema {
  up () {
    this.table('cases', (table) => {

      table.string('description')
      table.string('language', 5)
      table.string('domain', 50)
      table.string('specialty', 50)
      table.string('keywords', 512)

      // table.uuid('institution_id').references('id').inTable('intitutions').index('institution_id');

    })
  }

  down () {
    this.table('cases', (table) => {
      table.dropColumns('title', 'description', 'language', 'domain', 'specialty', 'keywords')
    })
  }
}

module.exports = AlterCaseAddAttributesSchema
