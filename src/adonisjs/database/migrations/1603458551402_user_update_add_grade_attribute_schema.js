'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserUpdateAddGradeAttributeSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('grade', 20)
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('grade')
    })
  }
}

module.exports = UserUpdateAddGradeAttributeSchema
