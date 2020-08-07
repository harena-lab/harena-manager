'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TypeSchema extends Schema {
  up () {
    this.dropIfExists('types')

    this.create('types', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('title', 100)
      table.string('description')

      table.uuid('kos_id').references('id').inTable('kos').index('kos_id');

      table.timestamps()
    })
  }

  down () {
    this.drop('types')
  }
}

module.exports = TypeSchema
