  'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CourseSchema extends Schema {
  up () {
	this.dropIfExists('courses')

    this.create('courses', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('name',100)
      table.timestamps()
    })
  }

  down () {
    this.drop('courses')
  }
}

module.exports = CourseSchema
