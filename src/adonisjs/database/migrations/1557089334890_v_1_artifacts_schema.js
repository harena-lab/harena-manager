'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArtifactsSchema extends Schema {

  up () {

    this.create('artifacts', (table) => {
      table.increments()

      table.integer('case_id').unsigned()
      table.foreign('case_id', 'fk_case_id').references('id').inTable('cases')

      // table.integer('user_id').unsigned()
      // table.foreign('user_id', 'user_id').references('id').inTable('users');

      table.string('fs_path',         300).notNullable()
      table.string('relative_path',   300).notNullable()
      table.timestamps()
    })
  }

  down () {
  	
    this.drop('artifacts')
  }
}

module.exports = ArtifactsSchema
