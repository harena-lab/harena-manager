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

const Role = use('App/Models/v1/Role');
const Permission = use('App/Models/v1/Permission');

const Database = use('Database')
const RESOURCE_DIR = "resources/"

const fs = require('fs');
const uuidv4 = require('uuid/v4');

class UserSeeder {
  async run() {
    const trx = await Database.beginTransaction()
    try{
      let jacinto = await User.findBy('username', 'jacinto')

      if (jacinto == null){

        let user = await this.seed_default_users(trx)
        await this.seed_default_case(user, trx)

        trx.commit()
      } else {
        console.log('Database is already populated')
      }

      jacinto = await User.findBy('username', 'jacinto')

      this.seed_roles_and_permissions(jacinto)
      trx.commit()

    } catch(e){
      console.log(e)
      console.log('Error on seed process. Transactions rolled back')
      trx.rollback()
    }
  }

  async seed_default_users(trx){
    try{
        let user = new User()
        user.username = 'jacinto'
        user.login = 'jacinto'
        user.email = 'jacinto@example.com'
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
      console.log(1)
    
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

    } catch (e){
      console.log(e)
    }
  }

  async seed_roles_and_permissions(user){
    console.log(user)

    let administrator = new Role()
    administrator.name = 'Administrator'
    administrator.slug = 'admin'
    administrator.description = 'system admin'
    administrator.id = await uuidv4()
    await administrator.save()

    let admin_permissions = new Permission()
    admin_permissions.name = 'admin permission'
    admin_permissions.slug = 'admin_permissions'
    admin_permissions.description = 'higher permissions'
    admin_permissions.id = await uuidv4()
    await admin_permissions.save()

    await administrator.permissions().attach([admin_permissions.id])
    await user.roles().attach([administrator.id])


    let creator = new Role()
    creator.name = 'Case Author'
    creator.slug = 'author'
    creator.description = 'author of clinical cases'
    creator.id = await uuidv4()
    await creator.save()

    let author_permission = new Permission()
    author_permission.name = 'Handle Cases'
    author_permission.slug = 'author_permissions'
    author_permission.description = 'can create, update, delete, list cases'
    author_permission.id = await uuidv4()
    await author_permission.save()

    await creator.permissions().attach([author_permission.id])
    // await user.roles().attach([creator.id])

    let player = new Role()
    player.name = 'Player'
    player.slug = 'player'
    player.description = 'player'
    player.id = await uuidv4()
    await player.save()

    let player_permission = new Permission()
    player_permission.name = 'Play Cases'
    player_permission.slug = 'player_permissions'
    player_permission.description = 'can play cases'
    player_permission.id = await uuidv4()
    await player_permission.save()

    await player.permissions().attach([player_permission.id])
    // await user.roles().attach([player.id])
  }
}

module.exports = UserSeeder
