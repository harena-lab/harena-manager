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
      user.id =  await uuidv4()

      await user.save(trx)

      const c = await Factory.model('App/Models/v1/Case').make({ name: 'case001-development', id:  await uuidv4() })
      await user.cases().save(c, trx)

      const cv = await Factory.model('App/Models/v1/CaseVersion').make({ source: fs.readFileSync(RESOURCE_DIR + 'case.md', 'utf8'), id:  await uuidv4() })
      await c.versions().save(cv, trx)

      //await Factory.model('App/Models/v1/User').createMany(5)
      trx.commit()


      const administrator = await Factory.model('Adonis/Acl/Role').make({ name: 'Administrator', slug:  'administrator', description: 'manage administration privileges'})
      await administrator.save()
      const admin_permission = await Factory.model('Adonis/Acl/Permission').make({ name: 'Manage users', slug:  'manage_users', description: 'Create, update, delete, list users'})
      await admin_permission.save()
      await administrator.permissions().attach([admin_permission.id])
      await user.roles().attach([administrator.id])

      const author = await Factory.model('Adonis/Acl/Role').make({ name: 'Case author', slug:  'author', description: 'manage cases'})
      await author.save()
      const author_permission = await Factory.model('Adonis/Acl/Permission').make({ name: 'Manage cases', slug:  'manage_cases', description: 'Create, update, delete, list cases'})
      await author_permission.save()
      await author.permissions().attach([author_permission.id])
      await user.roles().attach([author.id])

      const player = await Factory.model('Adonis/Acl/Role').make({ name: 'Player', slug:  'player', description: 'Case player'})
      await player.save()
      const player_permission = await Factory.model('Adonis/Acl/Permission').make({ name: 'Play cases', slug:  'play_cases', description: 'Play cases'})
      await player_permission.save()
      await player.permissions().attach([player_permission.id])
      await user.roles().attach([player.id])

    } catch(e){
      console.log(e)
      console.log('Error on seed process. Transactions rolled back')
      trx.rollback()
    }
  }
}

module.exports = UserSeeder
