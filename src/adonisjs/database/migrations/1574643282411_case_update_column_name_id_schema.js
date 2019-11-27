'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseUpdateColumnNameIdSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      // alter table

      table.dropPrimary('uuid')
      table.renameColumn('uuid', 'id')
      table.primary('id')

    })
  }

  down () {
    this.table('cases', (table) => {
      // reverse alternations

      table.dropPrimary('id')
      table.renameColumn('id', 'uuid')
      table.primary('uuid')


    })
  }
}

module.exports = CaseUpdateColumnNameIdSchema
