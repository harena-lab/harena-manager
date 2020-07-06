'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class ContributorsSchema extends Schema {
  up () {
      this.dropIfExists('contributors')

      this.create('contributors', (table) => {
          table.uuid('user_id').references('id').inTable('users').index('user_id');
          table.uuid('case_id').references('id').inTable('cases').index('case_id');
          table.primary(['case_id', 'user_id'])

          table.boolean('author')

          table.timestamps()
      })

      // copy data
      this.schedule(async (trx) => {
          console.log('executing schedule of contributor script')
          const cases = await Database.table('cases').transacting(trx)
          for (let i = 0; i < cases.length; i++) {
              console.log(cases[i])
              await Database.table('contributors').transacting(trx).insert({case_id:cases[i].id, user_id:cases[i].user_id, author:1, created_at:cases[i].created_at,updated_at:cases[i].updated_at})
          }
      })
  }

  down () {
    this.drop('contributors')
  }
}

module.exports = ContributorsSchema
