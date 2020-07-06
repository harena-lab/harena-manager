'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CasePropertySchema extends Schema {
  up () {
    this.dropIfExists('case_properties')

    this.create('case_properties', (table) => {
      table.uuid('case_id').references('id').inTable('cases').index('case_id');
      table.uuid('property_id').references('id').inTable('properties').index('property_id');
      table.primary(['case_id', 'property_id'])

      table.string('value', 255)
      table.timestamps()
    })
  }

  down () {
    this.drop('case_properties')
  }
}

module.exports = CasePropertySchema
