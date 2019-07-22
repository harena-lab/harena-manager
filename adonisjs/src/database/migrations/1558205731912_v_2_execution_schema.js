'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExecutionSchema extends Schema {
  up () {
    this.table('executions', (table) => {
      table.dropForeign('case_version_id', 'executions_case_version_id_foreign')
      table.dropIndex('case_id', 'caseversion_id')
      table.dropColumn('case_version_id')
      table.uuid('case_id')
      table.index('case_id', 'case_id')
      table.foreign('case_id ', 'executions_case_id').references('uuid').inTable('cases')

      table.dropForeign('user_id', 'executions_user_id_foreign')
      table.foreign('user_id','executions_user_id').references('users.id').onDelete('cascade')
    })
  }

  down () {
    this.table('executions', (table) => {
      table.dropForeign('user_id', 'executions_user_id')
      table.foreign('user_id','executions_user_id_foreign').references('users.id').onDelete('cascade')



      table.dropForeign('case_id', 'executions_case_id')
      table.dropIndex('case_id', 'case_id')
      table.dropColumn('case_id')
      table.integer('case_version_id').unsigned()
      table.index('case_version_id', 'caseversion_id')
      table.foreign('case_version_id').references('case_versions.id').onDelete('cascade')

    })
  }
}

module.exports = ExecutionSchema
