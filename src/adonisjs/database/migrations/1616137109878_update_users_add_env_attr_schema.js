'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateUsersAddEnvAttrSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.uuid('environment_id').references('id').inTable('environments').index('environment_id')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropForeign('environment_id')
      table.dropColumn('environment_id')
    })
  }
}

module.exports = UpdateUsersAddEnvAttrSchema
