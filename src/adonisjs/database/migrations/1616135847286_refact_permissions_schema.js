'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdatePermissionSchema extends Schema {
  up () {
    this.table('permissions', (table) => {
      // alter table
      // table.dropColumn('environment_id')
      // table.dropForeign('environment_id')
      // table.dropColumn('environment_id')
      table.uuid('environment_id').references('id').inTable('environments').index('environment_id')

      table.string('resource')
      table.uuid('resource_id')

      table.dropColumn('entity')
      table.dropColumn('subject')
      table.dropColumn('table')
      table.dropColumn('table_id')

    })
  }

  down () {
    this.table('permissions', (table) => {
      // reverse alternations
      table.dropForeign('environment_id')
      table.dropColumn('environment_id')
      table.dropColumn('resource_id')
      table.dropColumn('resource')

      table.string('entity')
      table.string('subject')
      table.string('table')
      table.uuid('table_id')
    })
  }
}

module.exports = UpdatePermissionSchema
