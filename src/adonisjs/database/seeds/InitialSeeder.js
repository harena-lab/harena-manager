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

const CaseVersion = use('App/Models/v1/CaseVersion');
const Case = use('App/Models/v1/Case');
const User = use('App/Models/v1/User');
const Quest = use('App/Models/v1/Quest');

const Role = use('App/Models/v1/Role');
const Permission = use('App/Models/v1/Permission');

const Database = use('Database')
const RESOURCE_DIR = "resources/"

const fs = require('fs');
const uuidv4 = require('uuid/v4');

class UserSeeder {
  async run() {
    let trx = await Database.beginTransaction()
    try{
      let jacinto = await User.findBy('username', 'jacinto')

      if (jacinto == null){

        let user = await this.seed_default_users(trx)

        let c = await this.seed_default_case(trx)

        await user.save(trx)

        await c.users().attach([user.id], (row) => {
          const AUTHOR = 0
          row.role = AUTHOR
        }, trx)
        // await user.cases().attach(c.id, trx)

        let roles = await this.seed_roles_and_permissions(trx)

        await trx.commit()
        
        trx = await Database.beginTransaction()

        await user.roles().attach([roles[0].id, roles[1].id], trx)

        let quest = new Quest()
        quest.title = 'default-quest'
        quest.id =  await uuidv4()
        await quest.save(trx)

        await user.quests().attach([quest.id], (row) => {
          row.role = 0
        }, trx)


        await trx.commit()


      } else {
        console.log('Database is already populated')
        trx.commit()
      }

    } catch(e){
      console.log('Error on seed process. Transactions rolled back. Log:')
      console.log(e)

      trx.rollback()
    }
  }

  async seed_default_users(trx){
    try{
        let user = new User()
        user.username = 'jacinto'
        user.login = 'jacinto'
        user.email = 'jacinto@email.com'
        user.password = 'jacinto'
        user.id =  await uuidv4()

        // await user.save(trx)
        return user
    } catch (e){
      console.log(e)
    }
  }

  async seed_default_case(trx){
    try{
   
      let c = new Case()
      c.title = 'default-case'
      c.description = 'Case for tests'
      c.language = 'pt-br'
      c.domain = 'domain-test'
      c.specialty = 'specialty-test'
      c.keywords = 'keyword1; keyword2'
      c.id = await uuidv4()

      let cv = new CaseVersion()
      cv.source = fs.readFileSync(RESOURCE_DIR + 'case.md', 'utf8')
      cv.id = await uuidv4()

      

      await c.versions().save(cv, trx)

      return c
    } catch (e){
      console.log(e)
    }
  }

  async seed_roles_and_permissions(trx){
    let admin = {name: 'Administrator', slug: 'admin', description: 'system admin', id: await uuidv4()}
    let author = {name: 'Case Author', slug: 'author', description: 'user who write cases', id: await uuidv4()}
    let player = {name: 'Player', slug: 'player', description: 'user who read cases', id: await uuidv4()}

    // let admin_permissions = {name: 'admin permissions', slug: 'admin_permissions', description: 'higher permissions', id: await uuidv4()}
    // let author_permissions = {name: 'author permissions', slug: 'author_permissions', description: 'can create, update, delete, list cases', id: await uuidv4()}
    // let player_permissions = {name: 'player permissions', slug: 'player_permissions', description: 'can play cases', id: await uuidv4()}


    let roles = await Factory.model('App/Models/v1/Role').makeMany(3, [admin, author, player])
    // let permissions = await Factory.model('App/Models/v1/Permission').makeMany(1, [admin_permissions], trx)

    // await roles[1].permissions().attach([permissions[1].id], trx)
    // await roles[2].permissions().attach([permissions[2].id], trx)

    await roles[0].save(trx)
    await roles[1].save(trx)
    await roles[2].save(trx)

    return roles

  }

}

module.exports = UserSeeder
