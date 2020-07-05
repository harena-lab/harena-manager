'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterContributorChangeAuthorToRoleSchema extends Schema {
  up () {
    this.table('contributors', (table) => {
      table.integer('role')
      table.dropColumn('author')
    })
  }

  down () {
    this.table('contributors', (table) => {
      table.boolean('author')
      table.dropColumn('role')
    })
  }
}

module.exports = AlterContributorChangeAuthorToRoleSchema
