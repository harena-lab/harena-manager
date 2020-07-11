'use strict'

const Schema = use('Schema')

class PermissionRoleTableSchema extends Schema {
  up () {
    this.dropIfExists('permission_role')

    this.create('permission_role', table => {
      table.uuid('role_id').references('id').inTable('roles').index('role_id');
      table.uuid('permission_id').references('id').inTable('permissions').index('permission_id');
      table.primary(['permission_id', 'role_id'])

      table.timestamps()
    })
  }

  down () {
    this.drop('permission_role')
  }
}

module.exports = PermissionRoleTableSchema
