'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestAnnotationsDropSchema extends Schema {
  up () {
    this.dropIfExists('quest_annotations')
  }

  down () {
    this.table('quest_annotations', (table) => {
      // reverse alternations
    })
  }
}

module.exports = QuestAnnotationsDropSchema
