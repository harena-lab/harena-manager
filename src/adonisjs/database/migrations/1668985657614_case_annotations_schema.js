'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseAnnotationsSchema extends Schema {
  up () {
    this.create('case_annotations', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.uuid('case_id').references('id').inTable('cases').index('case_id')
      table.uuid('property_id').references('id').inTable('properties').index('property_id')
      table.integer('location')
      table.integer('size')
      table.primary(['user_id', 'case_id', 'property_id', 'location', 'size'])

      table.string('value', 255)
      table.tinyint('source')
      table.timestamp('created_at').defaultTo(this.fn.now())
    })
  }

  down () {
    this.drop('case_annotations')
  }
}

module.exports = CaseAnnotationsSchema
