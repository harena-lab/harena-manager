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

const Institution = use('App/Models/v1/Institution')
const Property = use('App/Models/Property')
const CaseArtifacts = use('App/Models/CaseArtifact')
const CaseVersion = use('App/Models/v1/CaseVersion')
const Case = use('App/Models/v1/Case')
const Category = use('App/Models/v1/Category')
const User = use('App/Models/v1/User')
const Quest = use('App/Models/v1/Quest')
const Artifact = use('App/Models/v1/Artifact')
const Role = use('App/Models/v1/Role')

const fs = require('fs')
const uuidv4 = require('uuid/v4')

const Hash = use('Hash')
const Drive = use('Drive')
const Database = use('Database')
const Helpers = use('Helpers')

const ARTIFACTS_DIR = '/resources/artifacts/'

class UserSeeder {
  async run () {
    let trx = await Database.beginTransaction()
    try {
      const jacinto = await User.findBy('username', 'jacinto')

      if (jacinto == null) {

        const user = await this.seed_default_users(trx)

        const institution = await this.seed_institution(user, trx)
        // console.log(institution)
        await user.save(trx)

        // const c = await this.seed_default_case(user,institution, trx)

        // c.author_id = user.id

        // await this.seed_artifact_case(user, c, trx)
        await this.seed_artifact(user, trx)

        await this.seedCategories(user, trx)


        // console.log(user.id)

        // await c.author().attach([user.id], trx)

        const roles = await this.seed_roles(trx)

        // broken. Need fix
        // const quest = await this.seedQuest(user, trx)

        await trx.commit()

        trx = await Database.beginTransaction()

        await user.roles().attach([roles[0].id, roles[1].id, roles[2].id], trx)

        // await quest.cases().attach([c.id], (row) => {
        //   row.order_position = 0
        // }, trx)

        await trx.commit()
      } else {
        console.log('Database is already populated')
        trx.commit()
      }
    } catch (e) {
      console.log('Error on seed process. Transactions rolled back. Log:')
      console.log(e)

      trx.rollback()
    }
  }

  async seed_institution(user, trx) {
    try {
        const institution = new Institution()
        institution.id = await uuidv4()
        institution.acronym = 'uni'
        institution.title = 'Universidade'
        institution.country = 'UN'

        const institution2 = new Institution()
        institution2.id = await uuidv4()
        institution2.acronym = 'unicamp'
        institution2.title = 'Universidade Estadual de Campinas'
        institution2.country = 'BR'

        const institution3 = new Institution()
        institution3.id = await uuidv4()
        institution3.acronym = 'minho'
        institution3.title = 'Universidade do Minho'
        institution3.country = 'PT'

        // institution.save(trx)
        institution2.save(trx)
        institution3.save(trx)

        await user.institution().associate(institution, trx)
        return institution
    } catch (e) {
      console.log(e)
    }
  }

  async seed_default_users (trx) {
    try {
      const user = new User()
      user.username = 'jacinto'
      user.login = 'jacinto'
      user.email = 'jacinto@email.com'
      user.password = 'jacinto'
      user.grade = 'professor'

      user.id = await uuidv4()

      return user
    } catch (e) {
      console.log(e)
    }
  }

  async seed_default_case (user, institution, trx) {
    try {

      const c = new Case()
      c.title = 'default-case'
      c.description = 'Case for tests'
      c.language = 'pt-br'
      c.domain = 'domain-test'
      c.specialty = 'specialty-test'
      c.keywords = 'keyword1; keyword2'
      c.complexity = 'undergraduate'
      c.id = await uuidv4()
      console.log('kosdkoskdoskdoksd'+user.id)
      c.author_id = user.id

      const cv = new CaseVersion()
      cv.source = fs.readFileSync(Helpers.resourcesPath('case.md'), 'utf8')
      cv.id = await uuidv4()
      // cv.case_id = c.id
      console.log('c1--------------'+c)
console.log('user---------------'+user)

console.log(cv)
      await c.versions().save([cv.id], trx)
      console.log('salvoooooooooooooooooooooooooooooooooooooooooooooooou version')
      await c.institution().associate(institution, trx)
console.log('c2--------------'+c)
      return c
    } catch (e) {
      console.log(e)
    }
  }


  async seed_artifact (user, trx) {
    try {
      const artifact_id = 'default-quest-image'
      const fileName = artifact_id + '.png'
      const fs_path = Helpers.publicPath('/resources/artifacts/')

      const artifact = new Artifact()
      artifact.id = artifact_id
      artifact.relative_path = ARTIFACTS_DIR + fileName

      await Drive.copy(Helpers.resourcesPath('imgs/default-quest.png'), fs_path + fileName)

      await user.artifacts().save(artifact, trx)

    } catch (e) {
      console.log(e)
    }
  }


  async seed_artifact_case (user, c, trx) {
    try {
      const artifact_id = await uuidv4()
      const fileName = artifact_id + '.png'
      console.log('------------------------------' + c)
      const fs_path = Helpers.publicPath('/resources/artifacts/cases/') + c.id + '/'

      const case_relative_path = ARTIFACTS_DIR + 'cases/' + c.id + '/'

      const artifact = new Artifact()
      artifact.id = await uuidv4()
      artifact.relative_path = case_relative_path + fileName

      await Drive.copy(Helpers.resourcesPath('imgs/default-image.png'), fs_path + fileName)

      const ca = new CaseArtifacts()
      ca.case_id = c.id

      await ca.artifact().associate(artifact, trx)
      await user.artifacts().save(artifact, trx)

    } catch (e) {
      console.log(e)
    }
  }

  async seed_roles (trx) {
    const admin = { name: 'Administrator', slug: 'admin', description: 'system admin', id: await uuidv4() }
    const author = { name: 'Case Author', slug: 'author', description: 'user who write cases', id: await uuidv4() }
    const player = { name: 'Player', slug: 'player', description: 'user who read cases', id: await uuidv4() }

    const roles = await Factory.model('App/Models/v1/Role').makeMany(3, [admin, author, player])

    await roles[0].save(trx)
    await roles[1].save(trx)
    await roles[2].save(trx)

    return roles
  }


  // broken. Need fix
  async seedQuest(user, trx){
    const quest = new Quest()
    quest.id = 'default-quest'
    quest.title = 'default-quest'
    quest.color = '#505050'

    const artifactId = 'default-quest-image'

    const fileName = artifactId + '.png'

    const artifact = new Artifact()
    artifact.id = artifactId
    artifact.relative_path =  ARTIFACTS_DIR + 'quests/' + quest.id + '/' + fileName

    const fsPath = Helpers.publicPath('/resources/artifacts/quests/') + quest.id + '/'

    await Drive.copy(Helpers.resourcesPath('imgs/default-quest.png'), fsPath + fileName)

    await quest.artifact().associate(artifact, trx)
    await user.artifacts().save(artifact, trx)
    await quest.save(trx)
    await user.quests().attach([quest.id], (row) => {
      row.permission = 'delete'
    }, trx)

    return quest
  }

  async seedCategories(user, trx){
    const categories = [
      { id: 'quiz-da-emergencia',
        title: 'Quiz da Emergência',
        template: 'quiz-da-emergencia',
        artifactId: 'quiz-da-emergencia-image',
        url: 'imgs/quiz-emergencia.png' },
      { id: 'desafio-de-eletrocardiograma',
        title: 'Desafio de Eletrocardiograma',
        template: 'desafio-de-eletrocardiograma',
        artifactId: 'desafio-de-eletrocardiograma-image',
        url: 'imgs/desafio-eletro.png' },
      { id: 'desafio-radiologico',
        title: 'Desafio Radiológico',
        template: 'desafio-radiologico',
        artifactId: 'desafio-radiologico-image',
        url: 'imgs/desafio-radio.png' },
      { id: 'visita-virtual',
        title: 'Visita Virtual',
        template: 'visita-virtual',
        artifactId: 'visita-virtual-image',
        url: 'imgs/visita-virtual.png' },
      { id: 'decisoes-extremas',
        title: 'Decisões Extremas',
        template: 'decisoes-extremas',
        artifactId: 'decisoes-extremas-image',
        url: 'imgs/decisoes-extremas.png' },
      { id: 'desafio-pocus',
        title: 'Desafio POCUS',
        template: 'desafio-pocus',
        artifactId: 'desafio-pocus-image',
        url: 'imgs/desafio-pocus.png' }
    ]

    for (var c of categories) {
      const category = new Category()
      category.id = c.id
      category.title = c.title
      category.template = c.template

      const fileName = c.artifactId + '.png'

      const artifact = new Artifact()
      artifact.id = c.artifactId
      artifact.relative_path = ARTIFACTS_DIR + 'categories/' + c.id + '/' + fileName

      const fsPath = Helpers.publicPath('/resources/artifacts/categories/') + c.id + '/'
      await Drive.copy(Helpers.resourcesPath(c.url), fsPath + fileName)
      await category.artifact().associate(artifact, trx)
      await user.artifacts().save(artifact, trx)
      await category.save(trx)


    }
  }
}

module.exports = UserSeeder
