'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseSchema extends Schema {
  up () {
    this.create('cases', (table) => {
      table.increments()
      table.string('name').unique()

      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamps()
    })
  }

  down () {
    this.drop('cases')
  }
}

module.exports = CaseSchema
