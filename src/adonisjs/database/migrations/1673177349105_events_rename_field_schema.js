'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.table('events', (table) => {
      // replace quest_id by room_id
      table.dropForeign('quest_id')
      table.dropColumn('quest_id')
      table.uuid('room_id').references('id').inTable('rooms').index('room_id')
      table.tinyint('room_role')
    })
  }

  down () {
    // replace room_id by quest_id
    table.dropForeign('room_id')
    table.dropColumn('room_id')
    table.dropColumn('room_role')
    table.uuid('quest_id').references('id').inTable('quests').index('quest_id')
  }
}

module.exports = EventsSchema
