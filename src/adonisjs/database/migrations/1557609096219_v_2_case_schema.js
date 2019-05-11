'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      table.dropUnique('name')
    })
  }

  down () {
    this.table('cases', (table) => {
      table.unique('name')
    })
  }
}

module.exports = CaseSchema
