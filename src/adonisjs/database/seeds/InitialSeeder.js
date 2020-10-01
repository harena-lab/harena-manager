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

        const institution = await this.seed_institution(trx)
        const user = await this.seed_default_users(trx)
        const c = await this.seed_default_case(trx)

        const artifact = await this.seed_artifact(c, trx)
        await user.artifacts().save(artifact, trx)
        await user.institution().associate(institution, trx)

        await user.save(trx)

        await c.users().attach([user.id], (row) => {
          row.permission = 'delete'
        }, trx)

        const roles = await this.seed_roles(trx)
        const defaultQuest = await this.seedQuests(user, trx)

        await trx.commit()

        trx = await Database.beginTransaction()

        await user.roles().attach([roles[0].id, roles[1].id, roles[2].id], trx)

        await defaultQuest.cases().attach([c.id], (row) => {
          row.order_position = 0
        }, trx)

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

  async seed_institution(trx) {
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

        institution.save(trx)
        institution2.save(trx)
        institution3.save(trx)

        return institution
    } catch (e) {

    }
  }

  async seed_default_users (trx) {
    try {
      const user = new User()
      user.username = 'jacinto'
      user.login = 'jacinto'
      user.email = 'jacinto@email.com'
      user.password = 'jacinto'

      user.id = await uuidv4()

      return user
    } catch (e) {
      console.log(e)
    }
  }

  async seed_default_case (trx) {
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

      const cv = new CaseVersion()
      cv.source = fs.readFileSync(Helpers.resourcesPath('case.md'), 'utf8')
      cv.id = await uuidv4()

      await c.versions().save(cv, trx)

      return c
    } catch (e) {
      console.log(e)
    }
  }

  async seed_artifact (c, trx) {
    try {
      const artifact_id = await uuidv4()
      const fileName = artifact_id + '.png'

      const fs_path = Helpers.publicPath('/resources/artifacts/cases/') + c.id + '/'

      const case_relative_path = ARTIFACTS_DIR + 'cases/' + c.id + '/'

      const artifact = new Artifact()
      artifact.id = await uuidv4()
      artifact.relative_path = case_relative_path + fileName

      await Drive.copy(Helpers.resourcesPath('imgs/default-image.png'), fs_path + fileName)

      const ca = new CaseArtifacts()
      ca.case_id = c.id

      await ca.artifact().associate(artifact, trx)

      // let property   = new Property()
      // property.id    = await uuidv4()
      // property.title = 'shape'

      // await property.save(trx)

      // await artifact.properties().attach([property.id], (row) => {
      //   row.value = 'square'
      // }, trx)

      return artifact
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

  async seedQuests(user, trx){
    const quests = [
      { id: 'quiz-da-emergencia',
        title: 'Quiz da Emergência',
        color: '#e64e31',
        artifactId: 'quiz-da-emergencia-image',
        url: 'imgs/quiz-emergencia.png' },
      { id: 'desafio-de-eletrocardiograma',
        title: 'Desafio de Eletrocardiograma',
        color: '#ae9e00',
        artifactId: 'desafio-de-eletrocardiograma-image',
        url: 'imgs/desafio-eletro.png' },
      { id: 'desafio-radiologico',
        title: 'Desafio Radiológico',
        color: '#348f00',
        artifactId: 'desafio-radiologico-image',
        url: 'imgs/desafio-radio.png' },
      { id: 'visita-virtual',
        title: 'Visita Virtual',
        color: '#245797',
        artifactId: 'visita-virtual-image',
        url: 'imgs/visita-virtual.png' },
      { id: 'decisoes-extremas',
        title: 'Decisões Extremas',
        color: '#a34fa3',
        artifactId: 'decisoes-extremas-image',
        url: 'imgs/decisoes-extremas.png' },
      { id: 'default-quest',
        title: 'Default Quest',
        color: '#505050',
        artifactId: 'default-quest-image',
        url: 'imgs/default-quest.png' }
    ]

    let defaultQuest

    for (var q of quests) {
      console.log(q)
      const quest = new Quest()
      quest.id = q.id
      quest.title = q.title
      quest.color = q.color

      const fileName = q.artifactId + '.png'

      const artifactDefault = new Artifact()
      artifactDefault.id = q.artifactId
      artifactDefault.relative_path = ARTIFACTS_DIR + 'quests/' + q.id + '/' + fileName

      const fsPath = Helpers.publicPath('/resources/artifacts/quests/') + q.id + '/'
      await Drive.copy(Helpers.resourcesPath(q.url), fsPath + fileName)
      await quest.artifact().associate(artifactDefault, trx)
      await user.artifacts().save(artifactDefault, trx)
      await quest.save(trx)
      await user.quests().attach([quest.id], (row) => {
        row.permission = 'delete'
      }, trx)

      defaultQuest = quest
    }
    return defaultQuest
  }
}

module.exports = UserSeeder
