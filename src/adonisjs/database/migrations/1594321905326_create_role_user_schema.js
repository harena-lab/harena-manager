'use strict'

const Schema = use('Schema')

class RoleUserTableSchema extends Schema {
  up () {
    this.dropIfExists('role_user')

    this.create('role_user', table => {
      table.uuid('role_id').references('id').inTable('roles').index('role_id');
      table.uuid('user_id').references('id').inTable('users').index('user_id');
      table.primary(['user_id', 'role_id'])

      table.timestamps()
    })
  }

  down () {
    this.drop('role_user')
  }
}

module.exports = RoleUserTableSchema
