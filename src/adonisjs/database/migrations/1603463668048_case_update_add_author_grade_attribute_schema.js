'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseUpdateAddAuthorGradeAttributeSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      table.string('author_grade', 20)
    })
  }

  down () {
    this.table('cases', (table) => {
      table.dropColumn('author_grade')
    })
  }
}

module.exports = CaseUpdateAddAuthorGradeAttributeSchema
