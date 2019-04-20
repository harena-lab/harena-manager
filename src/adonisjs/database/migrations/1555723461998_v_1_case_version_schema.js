'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseVersionSchema extends Schema {
  up () {
    this.create('case_versions', (table) => {
      table.uuid('id')
      table.json('caseText')
      table.integer('case_id').unsigned().references('id').inTable('cases')
      table.timestamps()
    })
  }

  down () {
    this.drop('case_versions')
  }
}

module.exports = CaseVersionSchema
