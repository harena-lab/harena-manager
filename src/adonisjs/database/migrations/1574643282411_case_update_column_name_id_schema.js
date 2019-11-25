'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseUpdateColumnNameIdSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      // alter table

      table.dropIndex('uuid', 'uuid')
      table.renameColumn('uuid', 'id')
      table.primary('id')

    })
  }

  down () {
    this.table('cases', (table) => {
      // reverse alternations

      table.dropPrimary('id')
      table.renameColumn('id', 'uuid')
      table.index('uuid', 'uuid')


    })
  }
}

module.exports = CaseUpdateColumnNameIdSchema
