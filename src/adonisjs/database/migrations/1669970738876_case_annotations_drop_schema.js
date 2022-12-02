'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseAnnotationsDropSchema extends Schema {
  up () {
    this.dropIfExists('case_annotations')
  }

  down () {
    this.table('case_annotations', (table) => {
      // no rollback (transient)
    })
  }
}

module.exports = CaseAnnotationsDropSchema
