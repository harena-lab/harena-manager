'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseVersionSchema extends Schema {
  up () {
    this.create('case_versions', (table) => {
      table.increments()
      table.uuid('uuid')
      table.text('source')
      table.integer('case_id').unsigned()
      table.foreign('case_id', 'case_id').references('id').inTable('cases')
      table.timestamps()
    })
  }

  down () {
    this.drop('case_versions')
  }
}

module.exports = CaseVersionSchema
