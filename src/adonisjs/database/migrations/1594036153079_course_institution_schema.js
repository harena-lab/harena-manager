'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CourseInstitutionSchema extends Schema {
  up () {
	  this.dropIfExists('course_institutions')

    this.create('course_institutions', (table) => {
      table.uuid('institution_id').references('id').inTable('institutions').index('institution_id')
      table.uuid('course_id').references('id').inTable('courses').index('course_id')
      table.primary(['institution_id', 'course_id'])

      table.integer('access')
      table.timestamps()
    })
  }

  down () {
    this.drop('course_institutions')
  }
}

module.exports = CourseInstitutionSchema
