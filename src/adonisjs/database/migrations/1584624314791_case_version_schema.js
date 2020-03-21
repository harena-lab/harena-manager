'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseVersionSchema extends Schema {
  up () {
    this.dropIfExists('case_versions')

    this.create('case_versions', (table) => {
      table.uuid('id')
      table.primary('id')

      table.text('source')

      table.uuid('case_id').references('id').inTable('cases').index('case_id');

      table.timestamps()
    })
  }

  down () {
    this.drop('case_versions')
  }
}

module.exports = CaseVersionSchema
