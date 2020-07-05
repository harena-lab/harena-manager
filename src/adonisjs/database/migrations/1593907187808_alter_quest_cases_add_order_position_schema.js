'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterQuestCasesAddOrderPositionSchema extends Schema {
  up () {
    this.table('quest_cases', (table) => {
      table.integer('order_position')
    })
  }

  down () {
    this.table('quest_cases', (table) => {
      table.dropColumn('order_position')
    })
  }
}

module.exports = AlterQuestCasesAddOrderPositionSchema
