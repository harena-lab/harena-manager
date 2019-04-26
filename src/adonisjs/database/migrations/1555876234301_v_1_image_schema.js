'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageSchema extends Schema {
  up () {
    this.create('images', (table) => {
      table.increments()

      table.string('name')
      table.string('url')

      table.integer('case_id').unsigned().references('id').inTable('cases');
      table.integer('style_id').unsigned().references('id').inTable('styles');
      table.integer('dcc_id').unsigned().references('id').inTable('dccs');

      table.timestamps()
    })
  }

  down () {
    this.drop('images')
  }
}

module.exports = ImageSchema
