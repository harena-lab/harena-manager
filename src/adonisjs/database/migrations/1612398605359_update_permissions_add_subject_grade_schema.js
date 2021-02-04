'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdatePermissionsAddSubjectGradeSchema extends Schema {
  up () {
    this.table('permissions', (table) => {
      table.string('subject_grade', 20)
    })
  }

  down () {
    this.table('permissions', (table) => {
      table.dropColumn('subject_grade')
    })
  }
}

module.exports = UpdatePermissionsAddSubjectGradeSchema
