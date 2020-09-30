'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestsUsersCasesUpdateAddPermissionSchema extends Schema {
  up () {
    this.table('quests_users', (table) => {
      // alter table
      table.dropColumn('role')
      table.string('permission')
    })
  }

  down () {
    this.table('quests_users', (table) => {
      // reverse alternations
      table.integer('role')
      table.dropColumn('permission')
    })
  }
}

module.exports = QuestsUsersCasesUpdateAddPermissionSchema
