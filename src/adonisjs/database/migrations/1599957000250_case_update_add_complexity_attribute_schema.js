'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseUpdateAddComplexityAttributeSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      table.string('complexity')
    })
  }

  down () {
    this.table('cases', (table) => {
      table.dropColumn('complexity')
    })
  }
}

module.exports = CaseUpdateAddComplexityAttributeSchema
