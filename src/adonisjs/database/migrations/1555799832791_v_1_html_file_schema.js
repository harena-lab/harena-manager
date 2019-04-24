'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HtmlFileSchema extends Schema {
  up () {
    this.create('html_files', (table) => {
      table.increments()

      table.string('name')
      table.text('content')

      table.integer('case_id').unsigned().references('id').inTable('cases')
      table.integer('style_id').unsigned().references('id').inTable('styles')
      table.integer('dcc_id').unsigned().references('id').inTable('dccs');

      table.timestamps()
    })
  }

  down () {
    this.drop('html_files')
  }
}

module.exports = HtmlFileSchema
