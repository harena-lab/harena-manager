'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseUpdateAddCategoryRelationshipSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      // alter table
      table.uuid('category_id').references('id').inTable('categories').index('category_id')

    })
  }

  down () {
    this.table('cases', (table) => {
      // reverse alternations
      table.dropForeign('category_id')
      table.dropColumn('category_id')
    })
  }
}

module.exports = CaseUpdateAddCategoryRelationshipSchema
