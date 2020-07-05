'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class AlterCaseDropUserIdSchema extends Schema {
  up () {
    this.table('cases', (table) => {
      table.dropForeign('user_id')
      table.dropColumn('user_id')
    })
  }

  down () {
    this.table('cases', (table) => {
        table.uuid('user_id').references('id').inTable('users').index('user_id');
    })

    // copy data
    this.schedule(async (trx) => {
        const contributors = await Database.table('contributors').transacting(trx)
        for (let i = 0; i < contributors.length; i++) {
            await Database.table('cases').transacting(trx).where({id:contributors[i].case_id}).update({user_id:contributors[i].user_id})
        }
    })
  }
}

module.exports = AlterCaseDropUserIdSchema
