'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArtifactSchema extends Schema {
  up () {
    this.dropIfExists('artifacts')

    this.create('artifacts', (table) => {
      table.uuid('id')
      table.primary('id')

      table.string('fs_path', 300).notNullable()
      table.string('relative_path', 300).notNullable()

      table.uuid('user_id').references('id').inTable('users').index('user_id')
      table.uuid('case_id').references('id').inTable('cases').index('case_id')

      table.timestamps()
    })
  }

  down () {
    this.drop('artifacts')
  }
}

module.exports = ArtifactSchema
