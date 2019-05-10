'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class CaseVersionSchema extends Schema {
  async up () {
    const trx = await Database.beginTransaction()

      let sql = "ALTER TABLE cases ADD COLUMN uuid CHAR(36) UNIQUE"
      await trx.raw(sql)
  
      sql = "ALTER TABLE case_versions DROP FOREIGN KEY case_id"
      await trx.raw(sql)

      sql = "ALTER TABLE case_versions MODIFY case_id CHAR(36)"
      await trx.raw(sql)
    
      sql = "ALTER TABLE case_versions ADD CONSTRAINT case_id FOREIGN KEY (case_id) REFERENCES cases(uuid)"
      await trx.raw(sql)
    
      sql =  "ALTER TABLE artifacts DROP FOREIGN KEY fk_case_id"
      await trx.raw(sql)
    
      sql = "ALTER TABLE artifacts MODIFY case_id CHAR(36)"
      await trx.raw(sql)

      sql = "ALTER TABLE artifacts ADD CONSTRAINT fk_case_id FOREIGN KEY (case_id) REFERENCES cases(uuid)"
      await trx.raw(sql)

      sql =  "ALTER TABLE cases DROP PRIMARY KEY, CHANGE id id int(11);"
      await trx.raw(sql)
  
      sql =  "ALTER TABLE cases DROP COLUMN id"
      await trx.raw(sql)

      sql =  "ALTER TABLE cases ADD CONSTRAINT PRIMARY KEY (uuid)"
      await trx.raw(sql)
  
      trx.commit()
      trx.rollback() 
    
  }

  async down () {
    const trx = await Database.beginTransaction()

    let sql =  "ALTER TABLE cases DROP PRIMARY KEY"
    await trx.raw(sql)

    sql = "ALTER TABLE cases ADD COLUMN id INT(10) AUTO_INCREMENT UNIQUE"
    await trx.raw(sql)

    sql =  "ALTER TABLE cases ADD CONSTRAINT PRIMARY KEY (id)"
    await trx.raw(sql)

    sql =  "ALTER TABLE artifacts DROP FOREIGN KEY fk_case_id"
    await trx.raw(sql)

    sql = "ALTER TABLE artifacts MODIFY case_id INT(10)"
    await trx.raw(sql)

    sql = "ALTER TABLE artifacts ADD CONSTRAINT fk_case_id FOREIGN KEY (case_id) REFERENCES cases(id)"
    await trx.raw(sql)

    sql = "ALTER TABLE case_versions DROP FOREIGN KEY case_id"
    await trx.raw(sql)

    sql = "ALTER TABLE case_versions MODIFY case_id INT(10)"
    await trx.raw(sql)

    sql = "ALTER TABLE case_versions ADD CONSTRAINT case_id FOREIGN KEY (case_id) REFERENCES cases(id)"
    await trx.raw(sql)

    sql =  "ALTER TABLE cases DROP COLUMN uuid"
    await trx.raw(sql)
    
    trx.commit()
    trx.rollback() 
  }
}

module.exports = CaseVersionSchema
