'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GroupTitleKeySchema extends Schema {
  up () {
    this.table('groups', (table) => {
      // not null title and title unique
      // table.string('title')
      table.string('title').unique().notNullable().alter()
      // table.string('title').index('title')
      
    })
  }

  down () {
    this.table('groups', (table) => {
      table.string('title').notNullable().dropUnique().alter()
    })
  }
}

module.exports = GroupTitleKeySchema
