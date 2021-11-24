'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LoggerSchema extends Schema {
  up () {
    this.dropIfExists('loggers')

    this.create('loggers', (table) => {
      table.uuid('id')
      table.primary('id')

      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.uuid('case_id').references('id').inTable('cases').index('case_id')
      table.string('instance_id', 65)
      table.text('log')

      table.timestamps()
    })
  }

  down () {
    this.drop('loggers')
  }
}

module.exports = LoggerSchema
