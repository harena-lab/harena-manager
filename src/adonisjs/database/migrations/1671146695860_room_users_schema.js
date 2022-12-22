'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomUsersSchema extends Schema {
  up () {
    this.create('room_users', (table) => {
      table.uuid('room_id').references('id').inTable('rooms').index('room_id')
      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.tinyint('role')
      table.timestamp('created_at').defaultTo(this.fn.now())
    })
  }

  down () {
    this.drop('room_users')
  }
}

module.exports = RoomUsersSchema
