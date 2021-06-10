'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateUserPropertyValueLimitSchema extends Schema {
  up () {
    this.table('user_properties', (table) => {
      table.string('value', 1000).alter()
    })
  }

  down () {
    this.table('user_properties', (table) => {
      table.string('value', 255).alter()
    })
  }
}

module.exports = UpdateUserPropertyValueLimitSchema
