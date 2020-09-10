'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PropertySchema extends Schema {
  up () {
	  this.dropIfExists('properties')

    this.create('properties', (table) => {
      	table.uuid('id')
		    table.primary('id')

		    table.string('title', 100)
      	table.string('description')

      table.uuid('type_id').references('id').inTable('types').index('type_id')

      	table.timestamps()
    })
  }

  down () {
    this.drop('properties')
  }
}

module.exports = PropertySchema
