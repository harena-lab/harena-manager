'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenLoginSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('token_login')
      table.string('token_login_created_at')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('token_login')
      table.dropColumn('token_login_created_at')
    })
  }
}

module.exports = TokenLoginSchema
