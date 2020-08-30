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
const Artifact = use('App/Models/v1/Artifact');
const Role = use('App/Models/v1/Role');

const fs = require('fs');
const uuidv4 = require('uuid/v4');

const Hash = use('Hash')
const Drive = use('Drive');
const Database = use('Database')
const Helpers  = use('Helpers')

const RESOURCE_DIR = "resources/"
const ARTIFACTS_DIR = RESOURCE_DIR + "artifacts/"

class UserSeeder {
  async run() {
    let trx = await Database.beginTransaction()
    try{
      let jacinto = await User.findBy('username', 'jacinto')

      if (jacinto == null){

        let user = await this.seed_default_users(trx)

        let c = await this.seed_default_case(trx)
        
        let artifact = await this.seed_artifact(c, trx)
        await user.artifacts().save(artifact, trx)

        await user.save(trx)

        await c.users().attach([user.id], (row) => {
          const AUTHOR = 0
          row.role = AUTHOR
        }, trx)

        let roles = await this.seed_roles(trx)

        let quest = new Quest()
        quest.title = 'default-quest'
        quest.id =  await uuidv4()
        
        await quest.save(trx)

        await trx.commit()



        
        trx = await Database.beginTransaction()

        await user.roles().attach([roles[0].id, roles[1].id], trx)
        
        await quest.cases().attach([c.id], (row) => {
          row.order_position = 0
        }, trx)

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

        const safePassword = await Hash.make('jacinto')
        user.password = safePassword

        user.id =  await uuidv4()

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

  async seed_artifact(c, trx){
    try{
   
      const artifact_id       = await uuidv4() 
      let fileName = artifact_id + ".png"
      // let fs_path = Helpers.resourcesPath() + '/artifacts/cases/' 
      let fs_path = Helpers.publicPath('/resources/artifacts/cases/') + c.id + '/'

      let case_relative_path = ARTIFACTS_DIR + 'cases/' + c.id + '/'

      let artifact           = new Artifact()
      artifact.id            = await uuidv4()
      artifact.relative_path = case_relative_path + fileName
      artifact.fs_path       = fs_path + fileName
      artifact.case_id       = c.id

      await Drive.copy(Helpers.resourcesPath('home-image.png'), fs_path + fileName )

      await c.artifacts().save(artifact, trx)

      return artifact
    } catch (e){
      console.log(e)
    }
  }

  async seed_roles(trx){
    let admin = {name: 'Administrator', slug: 'admin', description: 'system admin', id: await uuidv4()}
    let author = {name: 'Case Author', slug: 'author', description: 'user who write cases', id: await uuidv4()}
    let player = {name: 'Player', slug: 'player', description: 'user who read cases', id: await uuidv4()}

    let roles = await Factory.model('App/Models/v1/Role').makeMany(3, [admin, author, player])

    await roles[0].save(trx)
    await roles[1].save(trx)
    await roles[2].save(trx)

    return roles

  }

}

module.exports = UserSeeder
