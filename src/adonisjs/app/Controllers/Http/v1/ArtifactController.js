'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const Env = use('Env')
const Drive = use('Drive')

const uuid4 = require('uuid/v4')
const path = require('path')
const fs = require('fs')

const Artifact = use('App/Models/v1/Artifact')
const Case = use('App/Models/v1/Case')
const Quest = use('App/Models/v1/Quest')
const CaseArtifacts = use('App/Models/CaseArtifact')

const hbjs = require('handbrake-js')
const https = require('https')

class ArtifactController {
  constructor () {
    // See this for more on MIM types: https://docs.openx.com/Content/publishers/adunit_linearvideo_mime_types.html
    this.validationOptions = {
      size: '100mb',
      types: ['image', 'video']
      // do not afford case insensitive check
      // extnames: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'mp4', 'avi', 'wmv']
    }

    this.validExtensions =
      ['png', 'jpg', 'jpeg', 'gif', 'svg', 'mp4', 'mpeg4', 'avi', 'wmv', 'mov']

    this.convertExtensions = ['avi', 'wmv', 'mov', 'mp4', 'mpeg4']

    this.relativePath = '/resources/artifacts/'
    this.baseUrl = Env.getOrFail('APP_URL')
  }

  async store ({ request, auth, response }) {
    try {
      const file = request.file('file', this.validationOptions)

      if (file == null)
        return response.status(500).json({message: 'File to upload is missing'})
    
      const extension = file.extname.toLowerCase()

      if (file.size > 100000000)
        return response.status(500)
          .json({ message: 'Size exceeds the maximum (100 MB)' })
      
      if (!this.validExtensions.includes(extension)) {
        return response.status(500)
          .json({ message: `Extension ${file.extname} not accepted` })
      }

      const questId = request.input('questId')
      const caseId = request.input('caseId', null)

      const artifactId = request.input('id') || await uuid4()
      const artifactOriginalName = `${artifactId}.${extension}`
      const artifactFileName = (this.convertExtensions.includes(extension))
        ? `${artifactId}x.mp4` : `${artifactId}.${extension}`
      let fs_path = Helpers.publicPath(this.relativePath)
      const conv_path = `${fs_path}convert/`

      const artifact = new Artifact()
      artifact.id = artifactId

      const bodyMessage = {
        filename: artifactFileName,
        size_in_bytes: file.size,
        type: file.type,
        subtype: file.subtype,
        extension: extension,
        status: file.status
      }

      if (caseId != null && questId == null) {
        const c = await Case.find(caseId)

        if (c == null) { return response.json({ message: 'Case id not found' }) }

        fs_path += `cases/${caseId}/`
        const case_relative_path = `${this.relativePath}cases/${caseId}/`

        artifact.relative_path = case_relative_path + artifactFileName

        const ca = new CaseArtifacts()
        ca.case_id = c.id

        await ca.artifact().associate(artifact)

        bodyMessage.case = c
        bodyMessage.url	 = this.baseUrl + artifact.relative_path
      }

      if (questId != null && caseId == null) {
        const quest = await Quest.find(questId)

        if (quest == null) {
          return response.json({ message: 'Quest id not found' })
        }
        const questRelativePath = `${this.relativePath}quests/${quest.id}/`

        artifact.relative_path = questRelativePath + artifactFileName

        await quest.artifact().associate(artifact)

        fs_path += `quests/${quest.id}/`

        bodyMessage.quest = quest
        bodyMessage.url = this.baseUrl + artifact.relative_path
      }

      if (questId == null && caseId == null) {
        artifact.relative_path = this.relativePath + artifactFileName
        bodyMessage.url = this.baseUrl + artifact.relative_path
      }

      if (this.convertExtensions.includes(extension)) {
        await file.move(conv_path, { name: artifactOriginalName,
                                     overwrite: false })
        console.log(`=== converting ${artifactOriginalName} to ${artifactFileName}`)

        const options = {
          input: conv_path + artifactOriginalName,
          output: conv_path + artifactFileName,
          preset: 'Normal',
          encoder: 'x264'
        }
        await new Promise((resolve, reject) => {
          hbjs.spawn(options)
            .on('error', err => {
              console.log(err)
              reject(err)
            })
            .on('progress', progress => {
              console.log(
                'Percent complete: %s, ETA: %s',
                progress.percentComplete,
                progress.eta
              )
            })
            .on('complete', async () => {
              try {
                await Drive.move(conv_path + artifactFileName, fs_path + artifactFileName)
                await Drive.delete(conv_path + artifactOriginalName)
                resolve()
              } catch (err) {
                reject(err)
              }
            })
        })
      } else
        await file.move(fs_path, { name: artifactFileName, overwrite: false })

      const classify = request.input('classify')
      if (classify != null && classify === 'true') {
        const serviceClass = await this.videoClassify(fs_path + artifactFileName)
        if (serviceClass.status === 200)
          bodyMessage.classification = serviceClass.classification
      }

      await auth.user.artifacts().save(artifact)

      return response.json(bodyMessage)
    } catch (e) {
      console.log('============ Artifact catch error')
      console.log(e)
      switch (e.message) {
        case 'dest already exists.':
          return response.status(500).json({ message: 'Could not upload artifact, id already exists.' })
        default:
          return response.status(e.status).json({ message: e.message })
      }
    }
  }

  async classify ({ request, auth, response }) {
    try {
      const file = request.file('file', this.validationOptions)

      if (file == null)
        return response.status(500).json({message: 'File to upload is missing'})
    
      const extension = file.extname.toLowerCase()

      if (file.size > 100000000)
        return response.status(500)
          .json({ message: 'Size exceeds the maximum (100 MB)' })
      
      if (extension !== 'mp4') {
        return response.status(500)
          .json({ message: `Extension ${file.extname} not accepted` })
      }

      return response.json(await this.videoClassify(file.tmpPath))
    } catch (e) {
      console.log('============ Artifact classification error')
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }

  async videoClassify(filePath) {
    const apiUrl = 'https://atc6h2hj2b.execute-api.us-east-1.amazonaws.com/test/predict-view-classification'
    const apiKey = '6OhDPvNqDv2WEIPjsPGQW6Vs0FhX7MV7X2CBMpkj'

    const file64 = await new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error reading file:', err)
        reject(err)
      } else {
        resolve(data.toString('base64'))
      }
      })
    })
  
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({ body: file64 })
      const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-API-Key': apiKey,
              'Content-Length': Buffer.byteLength(payload)
          }
      }

      console.log('=== sending request to', apiUrl)
      const req = https.request(apiUrl, options, (res) => {
          let data = '';
          res.on('data', (chunk) => {data += chunk})
          res.on('end', () => {
            const response = JSON.parse(data)
            const classification = (response.errorType || response.errorMessage)
              ? 'UN'
              : JSON.parse(response.body)
            resolve(
            { status: res.statusCode,
              classification: classification
            })}
          )
      })

      req.on('error', (error) => reject(error))
      req.write(payload)
      req.end()
    })
  }

  // Missing check permission
  async destroy ({ params, response }) {
    const trx = await Database.beginTransaction()

    try {
      const artifact = await Artifact.findBy('id', params.id)

      if (artifact != null) {

        await CaseArtifacts
        .query()
        .where('artifact_id', artifact.id)
        .delete()

        await artifact.delete(trx)
        Drive.delete(Helpers.publicPath(artifact.relative_path))
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

  async list ({ request, response }) {
    try {
      const cs = await Case.find(request.input('caseId'))

      let dir_ls = Helpers.publicPath('/resources/artifacts/cases/') + cs.id

      const fileList = await fs.promises.readdir(dir_ls)

      return response.json({directory: dir_ls, files: fileList})
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }
}

module.exports = ArtifactController
