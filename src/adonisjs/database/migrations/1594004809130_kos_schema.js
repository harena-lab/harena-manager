'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class KosSchema extends Schema {
  up () {
	  this.dropIfExists('kos')

    this.create('kos', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('title', 100)
      table.string('description')
      
      table.timestamps()
    })
  }

  down () {
    this.drop('kos')
  }
}

module.exports = KosSchema
