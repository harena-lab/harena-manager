'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseSchema extends Schema {
  up () {
    this.dropIfExists('cases')
    this.create('cases', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('title')

      table.uuid('user_id').references('id').inTable('users').index('user_id');

      table.timestamps()
    })
  }

  down () {
    this.drop('cases')
  }
}

module.exports = CaseSchema
