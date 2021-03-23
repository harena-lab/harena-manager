'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SemanticsSchema extends Schema {
  up () {
    this.dropIfExists('semantics')

    this.create('semantics', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('ontology')
      table.string('uri').unique()

      table.string('resource')
      table.uuid('resource_id')

      table.timestamps()
    })
  }

  down () {
    this.drop('semantics')
  }
}

module.exports = SemanticsSchema
