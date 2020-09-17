'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseUpdateAddInstitutionRelationshipSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      table.uuid('institution_id').references('id').inTable('institutions').index('institution_id')
    })
  }

  down () {
    this.table('cases', (table) => {
      table.dropForeign('institution_id')
      table.dropColumn('institution_id')
    })
  }
}

module.exports = CaseUpdateAddInstitutionRelationshipSchema
