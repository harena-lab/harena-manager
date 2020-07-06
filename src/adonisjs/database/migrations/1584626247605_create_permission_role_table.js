'use strict'

const Schema = use('Schema')

class PermissionRoleTableSchema extends Schema {
  up () {
    this.dropIfExists('permission_role')

    this.create('permission_role', table => {
      table.uuid('role_id').references('id').inTable('roles').index('role_id');
      table.uuid('permission_id').references('id').inTable('permissions').index('permission_id');
      table.primary(['permission_id', 'role_id'])



      // table.integer('permission_id').unsigned().index()
      // table.foreign('permission_id').references('id').on('permissions').onDelete('cascade')
      // table.integer('role_id').unsigned().index()
      // table.foreign('role_id').references('id').on('roles').onDelete('cascade')

      //table.integer('permission_id').references('id').inTable('permissions').index('permission_id');
      //table.integer('role_id').references('id').inTable('roles').index('role_id');
      //table.primary(['permission_id', 'role_id'])

      table.timestamps()
    })
  }

  down () {
    this.drop('permission_role')
  }
}

module.exports = PermissionRoleTableSchema
