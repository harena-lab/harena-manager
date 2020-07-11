'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.dropIfExists('users')

    this.create('users', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('username', 100).notNullable().unique()
      table.string('login', 80).unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()

      table.uuid('institution_id').references('id').inTable('institutions').index('institution_id');
      table.uuid('course_id').references('id').inTable('courses').index('course_id');

      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
