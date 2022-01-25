'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserUpdateColumnUsernameSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.dropUnique('username')
    })
  }

  down () {
    this.table('users', (table) => {
      table.unique('username')
    })
  }
}

module.exports = UserUpdateColumnUsernameSchema
