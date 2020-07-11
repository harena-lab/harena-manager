'use strict'

const Schema = use('Schema')

class PermissionUserTableSchema extends Schema {
  up () {
    this.dropIfExists('permission_user')

    this.create('permission_user', table => {
      table.uuid('user_id').references('id').inTable('users').index('user_id');
      table.uuid('permission_id').references('id').inTable('permissions').index('permission_id');

      table.primary(['permission_id', 'user_id'])

      table.timestamps()
    })
  }

  down () {
    this.drop('permission_user')
  }
}

module.exports = PermissionUserTableSchema
