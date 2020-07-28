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
        await this.seed_default_case(user, trx)

        await this.seed_roles_and_permissions(user, trx)

        let quest = new Quest()
        quest.title = 'default-quest'
        quest.id =  await uuidv4()
        await quest.save(trx)
        trx.commit()

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

        await user.save(trx)
        return user
    } catch (e){
      console.log(e)
    }
  }

  async seed_default_case(user, trx){
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


      // await user.contributes_with_cases().attach([c.id], trx)
      await c.users().attach(user.id, (row) => {
        const AUTHOR = 0
        row.role = AUTHOR
      }, trx)

      return c
    } catch (e){
      console.log(e)
    }
  }

  async seed_roles_and_permissions(user, trx){
    let administrator = {name: 'Administrator', slug: 'admin', description: 'system admin', id: await uuidv4()}
    let author = {name: 'Case Author', slug: 'author', description: 'user who write cases', id: await uuidv4()}
    let player = {name: 'Player', slug: 'player', description: 'user who read cases', id: await uuidv4()}

    let admin_permissions = {name: 'admin permissions', slug: 'admin_permissions', description: 'higher permissions', id: await uuidv4()}
    let author_permissions = {name: 'author permissions', slug: 'author_permissions', description: 'can create, update, delete, list cases', id: await uuidv4()}
    let player_permissions = {name: 'player permissions', slug: 'player_permissions', description: 'can play cases', id: await uuidv4()}


    let roles = await Factory.model('App/Models/v1/Role').createMany(3, [administrator, author, player], trx)
    let permissions = await Factory.model('App/Models/v1/Permission').createMany(3, [admin_permissions, author_permissions, player_permissions], trx)

    await roles[0].permissions().attach([permissions[0].id], trx)
    await roles[1].permissions().attach([permissions[1].id], trx)
    await roles[2].permissions().attach([permissions[2].id], trx)


    // await user.roles().attach([administrator.id], trx)

    return roles

    // let player_permission = new Permission()
    // player_permission.name = 'Play Cases'
    // player_permission.slug = 'player_permissions'
    // player_permission.description = 'can play cases'
    // player_permission.id = await uuidv4()
    // await player_permission.save(trx)

    // // trx.commit()

    // // trx = await Database.beginTransaction()

    // // const roleAdmin = await Role.findBy('slug', 'admin')
    // await administrator.permissions().attach([admin_permissions.id], trx)
    // await user.roles().attach([administrator.id], trx)
     
    // // const roleAuthor = await Role.findBy('slug', 'author')
    // await author.permissions().attach([author_permission.id], trx)
    // await user.roles().attach([author.id], trx)

    // // const rolePlayer = await Role.findBy('slug', 'player')
    // await rolePlayer.permissions().attach([player_permission.id], trx)
    // await user.roles().attach([rolePlayer.id], trx)
  
    // trx.commit()
  }

}

module.exports = UserSeeder
