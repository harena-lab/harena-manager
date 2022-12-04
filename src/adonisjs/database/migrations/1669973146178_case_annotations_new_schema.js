'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseAnnotationsSchema extends Schema {
  up () {
    this.create('case_annotations', (table) => {
      table.uuid('case_id').references('id').inTable('cases').index('case_id')
      table.uuid('property_id').references('id').inTable('properties').index('property_id')
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.string('range', 50)
      table.primary(['case_id', 'property_id', 'user_id', 'range'])

      table.string('fragment', 255)
      table.text('value')
      table.tinyint('source')
      table.timestamp('created_at').defaultTo(this.fn.now())
    })
  }

  down () {
    // no rollback (transient)
  }
}

module.exports = CaseAnnotationsSchema
