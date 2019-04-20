'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExecutionSchema extends Schema {
  up () {
    this.create('executions', (table) => {
      table.increments()
      table.integer('user_id').unsigned().index('user_id')
      table.integer('case_id').unsigned().index('case_id')
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.foreign('case_id').references('cases.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('executions')
  }
}

module.exports = ExecutionSchema
