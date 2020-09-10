'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenSchema extends Schema {
  up () {
    this.dropIfExists('tokens')

    this.create('tokens', (table) => {
    	table.increments()

		  table.string('token', 255).notNullable().unique().index()
    	table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)

	    table.uuid('user_id').references('id').inTable('users').index('user_id')

    	table.timestamps()
    })
  }

  down () {
    this.drop('tokens')
  }
}

module.exports = TokenSchema
