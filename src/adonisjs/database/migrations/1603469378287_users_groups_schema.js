'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersGroupsSchema extends Schema {
  up () {
    this.create('users_groups', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.uuid('group_id').references('id').inTable('groups').index('group_id')
      table.primary(['group_id', 'user_id'])

      table.timestamps()
    })
  }

  down () {
    this.drop('users_groups')
  }
}

module.exports = UsersGroupsSchema
