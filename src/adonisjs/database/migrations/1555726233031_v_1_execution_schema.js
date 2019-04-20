'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExecutionSchema extends Schema {
  up () {
    this.create('executions', (table) => {
      table.increments()
      table.integer('user_id').unsigned().index('user_id')
      table.integer('case_version_id').unsigned().index('caseversion_id')
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.foreign('case_version_id').references('case_versions.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('executions')
  }
}

module.exports = ExecutionSchema
