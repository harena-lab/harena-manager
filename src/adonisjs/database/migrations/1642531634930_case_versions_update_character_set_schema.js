'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseVersionsUpdateCharacterSetSchema extends Schema {
  up () {
    this.table('case_versions', (table) => {
      table.text('source').collate('utf8mb4_unicode_ci').alter()
    })
  }

  down () {
    this.table('case_versions', (table) => {
      table.text('source').alter()
    })
  }
}

module.exports = CaseVersionsUpdateCharacterSetSchema
