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

const RESOURCE_DIR = "resources/"

const fs = require('fs');

class UserSeeder {
  async run() {
    let user = new User()
    user.username = 'jacinto'
    user.email = 'jacinto@example.com' 
    user.password = 'jacinto'

    const c = await Factory.model('App/Models/v1/Case').make({ name: 'case001-development' })
    await user.cases().save(c)

    const cv = await Factory.model('App/Models/v1/CaseVersion').make({ source: fs.readFileSync(RESOURCE_DIR + 'case.md', 'utf8') })
    
    await c.versions().save(cv)

    await Factory.model('App/Models/v1/User').createMany(5)
  }
}

module.exports = UserSeeder
