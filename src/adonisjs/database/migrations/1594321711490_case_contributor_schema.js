'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CaseContributorSchema extends Schema {
  up () {

	this.dropIfExists('case_contributors')

    this.create('case_contributors', (table) => {
      table.uuid('user_id').references('id').inTable('users').index('user_id');
      table.uuid('case_id').references('id').inTable('cases').index('case_id');
      table.primary(['case_id', 'user_id'])

      table.integer('role')

      table.timestamps()
    })
  }

  down () {
    this.drop('case_contributors')
  }
}

module.exports = CaseContributorSchema
