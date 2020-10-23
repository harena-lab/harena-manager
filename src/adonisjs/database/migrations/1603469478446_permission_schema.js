'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissionSchema extends Schema {
  up () {
    this.create('permissions', (table) => {
      table.uuid('id')
      table.primary('id')

      // all, institution, course, group, quest, user
      table.string('scope')
      // which institution, which course, which group etc...
      table.string('filter')
      // play, read, share, comment, edit
      table.string('level')

      table.uuid('case_id').references('id').inTable('cases').index('case_id')

      table.timestamps()
    })
  }

  down () {
    this.drop('permissions')
  }
}

module.exports = PermissionSchema
