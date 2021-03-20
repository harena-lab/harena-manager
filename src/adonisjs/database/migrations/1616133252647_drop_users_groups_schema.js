'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DropUsersGroupsSchema extends Schema {
  up () {
    this.dropIfExists('users_groups')
  }

  down () {
    this.create('users_groups', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.uuid('group_id').references('id').inTable('groups').index('group_id')
      table.primary(['group_id', 'user_id'])

      table.timestamps()
    })
  }
}

module.exports = DropUsersGroupsSchema
