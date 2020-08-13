'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseSchema extends Schema {
  up () {
    this.dropIfExists('cases')
    this.create('cases', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('title').notNullable()
      table.string('description')
      table.string('language', 5)
      table.string('domain', 50)
      table.string('specialty', 50)
      table.string('keywords', 512)
      table.string('original_date', 10)

      // table.uuid('user_id').references('id').inTable('users').index('user_id');

      table.timestamps()
    })
  }

  down () {
    this.drop('cases')
  }
}

module.exports = CaseSchema
