'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GroupSchema extends Schema {
  up () {
    this.dropIfExists('groups')

    this.create('groups', (table) => {
      table.uuid('id')
      table.primary('id')
      table.string('title')
      table.timestamps()
    })
  }

  down () {
    this.drop('groups')
  }
}

module.exports = GroupSchema
