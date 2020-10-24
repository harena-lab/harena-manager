'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DropUsersCasesSchema extends Schema {
  up () {
    this.dropIfExists('users_cases')
  }

  down () {
    this.create('users_cases', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.uuid('case_id').references('id').inTable('cases').index('case_id')
      table.primary(['case_id', 'user_id'])

      table.string('permission')

      table.timestamps()
    })
  }
}

module.exports = DropUsersCasesSchema
