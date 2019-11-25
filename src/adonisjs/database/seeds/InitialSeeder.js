'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const User = use('App/Models/v1/User');
const Database = use('Database')
const RESOURCE_DIR = "resources/"

const fs = require('fs');
const uuidv4 = require('uuid/v4');

class UserSeeder {
  async run() {
    const trx = await Database.beginTransaction()
    try{
      let user = new User()
      user.username = 'jacinto'
      user.email = 'jacinto@example.com' 
      user.password = 'jacinto'
 
      await user.save(trx)

      const c = await Factory.model('App/Models/v1/Case').make({ name: 'case001-development', id:  await uuidv4() })
      await user.cases().save(c, trx)
  
      const cv = await Factory.model('App/Models/v1/CaseVersion').make({ source: fs.readFileSync(RESOURCE_DIR + 'case.md', 'utf8') })
      
      await c.versions().save(cv, trx)
  
      await Factory.model('App/Models/v1/User').createMany(5)
      
      trx.commit()
    } catch(e){
      console.log(e)
      console.log('Error on seed process. Transactions rolled back')
      trx.rollback()
    }
  }
}

module.exports = UserSeeder
