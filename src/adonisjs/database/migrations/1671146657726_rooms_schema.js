'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomsSchema extends Schema {
  up () {
    this.create('rooms', (table) => {
      table.uuid('id')
      table.primary('id')
      table.string('title').notNullable()
      table.text('description')
      table.uuid('artifact_id').references('id').inTable('artifacts').index('artifact_id')
      table.uuid('quest_id').references('id').inTable('quests').index('quest_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('rooms')
  }
}

module.exports = RoomsSchema
