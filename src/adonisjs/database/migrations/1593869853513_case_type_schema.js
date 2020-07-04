'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseTypeSchema extends Schema {
  up () {
    this.create('case_types', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('name', 100)

      table.timestamps()
    })
  }

  down () {
    this.drop('case_types')
  }
}

module.exports = CaseTypeSchema
