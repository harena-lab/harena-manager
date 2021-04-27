'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const Env = use('Env')

const uuid4 = require('uuid/v4')

const Artifact = use('App/Models/v1/Artifact')
const Case = use('App/Models/v1/Case')
const Quest = use('App/Models/v1/Quest')
const CaseArtifacts = use('App/Models/CaseArtifact')

class ArtifactController {
  constructor () {
    // See this for more on MIM types: https://docs.openx.com/Content/publishers/adunit_linearvideo_mime_types.html
    this.validationOptions = {
      size: '100mb',
      types: ['image', 'video'],
      extnames: ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi', '.wmv']
    }

    this.relativePath = '/resources/artifacts/'
    this.baseUrl = Env.getOrFail('APP_URL')
  }

  async store ({ request, auth, response }) {
    try {
      const file = request.file('file', this.validationOptions)

      const questId = request.input('questId')
      const caseId = request.input('caseId', null)

      const artifactId = request.input('id') || await uuid4()
      const artifactFileName = artifactId + '.' + file.extname
      let fs_path = Helpers.publicPath(this.relativePath)

      const artifact = new Artifact()
      artifact.id = artifactId

      const bodyMessage = {
        filename: artifactFileName,
        size_in_bytes: file.size,
        type: file.type,
        subtype: file.subtype,
        extension: file.extname,
        status: file.status
      }

      if (caseId != null && questId == null) {
        var c = await Case.find(caseId)

        if (c == null) { return response.json({ message: 'Case id not found' }) }

        fs_path += 'cases/' + caseId + '/'
        const case_relative_path = this.relativePath + 'cases/' + caseId + '/'

        artifact.relative_path = case_relative_path + artifactFileName

        const ca = new CaseArtifacts()
        ca.case_id = c.id

        await ca.artifact().associate(artifact)

        bodyMessage.case = c
        bodyMessage.url	 = this.baseUrl + artifact.relative_path
      }

      if (questId != null && caseId == null) {
        var quest = await Quest.find(questId)

        if (quest == null) {
          return response.json({ message: 'Quest id not found' })
        }
        const questRelativePath = this.relativePath + 'quests/' + quest.id + '/'

        artifact.relative_path = questRelativePath + artifactFileName

        await quest.artifact().associate(artifact)

        fs_path += 'quests/' + quest.id + '/'

        bodyMessage.quest = quest
        bodyMessage.url = this.baseUrl + artifact.relative_path
      }

      if (questId == null && caseId == null) {
        artifact.relative_path = this.relativePath + artifactFileName
        bodyMessage.url = this.baseUrl + artifact.relative_path
      }

      await file.move(fs_path, { name: artifactFileName, overwrite: false })
      await auth.user.artifacts().save(artifact)

      return response.json(bodyMessage)
    } catch (e) {
      console.log('============ Artifact catch error')
      console.log(e)
      switch (e.message) {
        case 'dest already exists.':
          return response.status(500).json({ message: 'Could not upload artifact, id already exists.' })
          break;
        default:
          return response.status(e.status).json({ message: e.message })
      }

    }
  }


// Missing check permission
  async destroy ({ params, response }) {
    const trx = await Database.beginTransaction()

    try {
      const artifact = await Artifact.findBy('id', params.id)

      if (artifact != null) {
        await artifact.delete(trx)

        trx.commit()
        return response.json('artifact successfully deleted')
      } else {
        trx.rollback()
        return response.status(500).json('artifact not found')
      }
    } catch (e) {
      console.log(e)
      trx.rollback()

      return response.status(500).json({ message: e })
    }
  }
}

module.exports = ArtifactController
