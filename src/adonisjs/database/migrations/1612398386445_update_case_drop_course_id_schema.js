'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateCaseDropCourseIdSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.dropForeign('course_id')
      table.dropColumn('course_id')
    })
  }

  down () {
    this.table('users', (table) => {
      table.uuid('course_id').references('id').inTable('courses').index('course_id')
    })
  }
}

module.exports = UpdateCaseDropCourseIdSchema
