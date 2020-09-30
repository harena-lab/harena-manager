'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersCasesUpdateAddPermissionSchema extends Schema {
  up () {
    this.table('users_cases', (table) => {
      // alter table
      table.dropColumn('role')
      table.string('permission')
    })
  }

  down () {
    this.table('users_cases', (table) => {
      table.integer('role')
      table.dropColumn('permission')
    })
  }
}

module.exports = UsersCasesUpdateAddPermissionSchema
