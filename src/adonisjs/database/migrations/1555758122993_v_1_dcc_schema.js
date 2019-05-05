'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DccSchema extends Schema {
  up () {
    this.create('dccs', (table) => {
      table.increments()

      table.string('name')
      table.integer('case_id').unsigned().references('id').inTable('cases');

      table.timestamps()
    })
  }

  down () {
    this.drop('dccs')
  }
}

module.exports = DccSchema
