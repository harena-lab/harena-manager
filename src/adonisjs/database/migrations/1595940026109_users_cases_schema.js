'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersCasesSchema extends Schema {
  up () {
    this.dropIfExists('users_cases')

    this.create('users_cases', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id');
      table.uuid('case_id').references('id').inTable('cases').index('case_id');
      table.primary(['case_id', 'user_id'])

      table.integer('role')

      table.timestamps()
    })
  }

  down () {
    this.drop('users_cases')
  }
}

module.exports = UsersCasesSchema
