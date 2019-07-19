'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class ArtifactSchema extends Schema {
  async up () {
    const trx = await Database.beginTransaction()

    let sql = "ALTER TABLE artifacts DROP FOREIGN KEY artifacts_case_id_foreign"
    await trx.raw(sql)
  
    sql = "ALTER TABLE artifacts ADD CONSTRAINT artifacts_case_id_foreign FOREIGN KEY (case_id) REFERENCES cases(uuid) ON DELETE CASCADE"
    await trx.raw(sql)

    trx.commit()
    trx.rollback() 
  }

  async down () {
    const trx = await Database.beginTransaction()

    let sql = "ALTER TABLE artifacts DROP FOREIGN KEY artifacts_case_id_foreign"
    await trx.raw(sql)
  
    sql = "ALTER TABLE artifacts ADD CONSTRAINT artifacts_case_id_foreign FOREIGN KEY (case_id) REFERENCES cases(uuid)"
    await trx.raw(sql)

    trx.commit()
    trx.rollback() 
  }
}

module.exports = ArtifactSchema
