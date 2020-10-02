'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategorySchema extends Schema {
  up () {
    this.dropIfExists('categories')

    this.create('categories', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('title', 255)
      table.string('template', 255)

      table.uuid('artifact_id').references('id').inTable('artifacts').index('artifact_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('categories')
  }
}

module.exports = CategorySchema
