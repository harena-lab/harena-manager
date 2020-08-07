'use strict'

const Schema = use('Schema')

class PermissionsTableSchema extends Schema {
  up () {
    this.dropIfExists('permissions')

    this.create('permissions', table => {
      table.uuid('id')
      table.primary('id')

      table.string('slug').notNullable().unique()
      table.string('name').notNullable().unique()
      table.text('description').nullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('permissions')
  }
}

module.exports = PermissionsTableSchema
