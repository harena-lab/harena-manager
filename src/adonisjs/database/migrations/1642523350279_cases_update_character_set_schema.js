'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CasesUpdateCharacterSetSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      table.string('title').notNullable().collate('utf8mb4_unicode_ci').alter()
      table.string('description').collate('utf8mb4_unicode_ci').alter()
      table.string('domain', 50).collate('utf8mb4_unicode_ci').alter()
      table.string('specialty', 50).collate('utf8mb4_unicode_ci').alter()
      table.string('keywords', 512).collate('utf8mb4_unicode_ci').alter()
      table.text('source').collate('utf8mb4_unicode_ci')
    })
  }

  down () {
    this.table('cases', (table) => {
      table.string('title').notNullable().alter()
      table.string('description').alter()
      table.string('domain', 50).alter()
      table.string('specialty', 50).alter()
      table.string('keywords', 512).alter()
      table.dropColumn('source')
    })
  }
}

module.exports = CasesUpdateCharacterSetSchema
