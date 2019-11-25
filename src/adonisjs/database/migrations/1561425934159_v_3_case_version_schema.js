'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class CaseVersionSchema extends Schema {
  async up () {
    const trx = await Database.beginTransaction()

    let sql = "ALTER TABLE case_versions DROP FOREIGN KEY case_id"
    await trx.raw(sql)
  
    sql = "ALTER TABLE case_versions ADD CONSTRAINT case_id FOREIGN KEY (case_id) REFERENCES cases(uuid) ON DELETE CASCADE"
    await trx.raw(sql)

    trx.commit()
    trx.rollback() 
  }

  async down () {
    const trx = await Database.beginTransaction()

    let sql = "ALTER TABLE case_versions DROP FOREIGN KEY case_id"
    await trx.raw(sql)
  
    sql = "ALTER TABLE case_versions ADD CONSTRAINT case_id FOREIGN KEY (case_id) REFERENCES cases(uuid)"
    await trx.raw(sql)

    trx.commit()
    trx.rollback()
  }
}

module.exports = CaseVersionSchema
