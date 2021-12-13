'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TermsSchema extends Schema {
  up () {
    this.dropIfExists('terms')

    this.create('terms', (table) => {
      table.string('id')
      table.primary('id')

      table.string('title')
      table.string('adult_term')
      table.string('child_term')
      table.boolean('image_capture')
      table.boolean('video_capture')

      table.timestamps()
    })
  }

  down () {
    this.drop('terms')
  }
}

module.exports = TermsSchema
