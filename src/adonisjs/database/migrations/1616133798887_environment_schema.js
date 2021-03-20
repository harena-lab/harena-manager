'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EnvironmentSchema extends Schema {
  up () {
    this.dropIfExists('environments')

    this.create('environments', (table) => {
      table.uuid('id')
      table.primary('id')
      table.string('name')
      table.timestamps()
    })

  }

  down () {
    this.drop('environments')
  }
}

module.exports = EnvironmentSchema
