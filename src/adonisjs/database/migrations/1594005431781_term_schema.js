'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TermSchema extends Schema {
  up () {
	  this.dropIfExists('terms')

    this.create('terms', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('value', 255)

	    table.uuid('property_id').references('id').inTable('properties').index('property_id')

      table.timestamps()
    })
  }

  down () {
    this.drop('terms')
  }
}

module.exports = TermSchema
