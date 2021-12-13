'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersTermsSchema extends Schema {
  up () {
    this.dropIfExists('users_terms')

    this.create('users_terms', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.string('term_id').references('id').inTable('terms').index('term_id')
      table.timestamps()
      table.primary(['user_id', 'term_id', 'created_at'])
      table.string('name_participant')
      table.string('name_responsible')
      table.string('email_responsible')
      table.string('date')
      table.string('role')
      table.boolean('agree')
    })
  }

  down () {
    this.drop('users_terms')
  }
}

module.exports = UsersTermsSchema
