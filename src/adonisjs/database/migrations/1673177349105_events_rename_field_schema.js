'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.table('events', (table) => {
      // replace quest_id by room_id
      table.uuid('room_id').references('id').inTable('rooms').index('room_id')
      table.tinyint('room_role')
      table.dropForeign('quest_id')
      table.dropColumn('quest_id')
    })
  }

  down () {
    // do nothing because it will be incorporated into the original schema
  }
}

module.exports = EventsSchema
