'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StyleSchema extends Schema {
  up () {
    this.create('styles', (table) => {
      table.increments()
      table.timestamps()

      table.string('name')
      

    })
  }

  down () {
    this.drop('styles')
  }
}

module.exports = StyleSchema
