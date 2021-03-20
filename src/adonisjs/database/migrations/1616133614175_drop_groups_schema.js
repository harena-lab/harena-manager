'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DropGroupSchema extends Schema {
  up () {
    this.dropIfExists('groups')
  }

  down () {
    this.create('groups', (table) => {
      table.uuid('id')
      table.primary('id')
      table.string('title')
      table.timestamps()
    })
  }
}

module.exports = DropGroupSchema
