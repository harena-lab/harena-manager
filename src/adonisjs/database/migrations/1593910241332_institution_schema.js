'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InstitutionSchema extends Schema {
  up () {
    this.dropIfExists('institutions')

    this.create('institutions', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('acronym', 30)
      table.string('name', 100)
      table.string('country', 2)

      table.timestamps()
    })
  }

  down () {
    this.drop('institutions')
  }
}

module.exports = InstitutionSchema
