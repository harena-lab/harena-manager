'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomCasesSchema extends Schema {
  up () {
    this.create('room_cases', (table) => {
      table.uuid('room_id').references('id').inTable('rooms').index('room_id')
      table.uuid('case_id').references('id').inTable('cases').index('case_id')
      table.primary(['room_id', 'case_id'])
      table.timestamp('created_at').defaultTo(this.fn.now())
    })
  }

  down () {
    this.drop('room_cases')
  }
}

module.exports = RoomCasesSchema
