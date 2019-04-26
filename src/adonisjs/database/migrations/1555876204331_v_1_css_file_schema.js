'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CssFileSchema extends Schema {
  up () {
    this.create('css_files', (table) => {
      table.increments()

      table.string('name')
      table.text('content')
      table.integer('case_id').unsigned().references('id').inTable('cases');
      table.integer('style_id').unsigned().references('id').inTable('styles');
      table.integer('dcc_id').unsigned().references('id').inTable('dccs');

      table.timestamps()
    })
  }

  down () {
    this.drop('css_files')
  }
}

module.exports = CssFileSchema
