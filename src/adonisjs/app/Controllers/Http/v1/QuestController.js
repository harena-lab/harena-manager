'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const Helpers = use('Helpers')
const Drive = use('Drive')

const Quest = use('App/Models/v1/Quest')
const User = use('App/Models/v1/User')
const Case = use('App/Models/v1/Case')
const Role = use('App/Models/v1/Role')
const Artifact = use('App/Models/v1/Artifact')
const Property = use('App/Models/v1/Property')
const QuestAnnotation = use('App/Models/v1/QuestAnnotation')
const Room = use('App/Models/v1/Room')
const RoomPermissionController =
  use('App/Controllers/Http/v1/RoomPermissionController')

const uuidv4 = require('uuid/v4')

class QuestController {
  async index ({ response }) {
    try {
      const quests = await Quest.all()
      return response.json(quests)
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const user = auth.user

      const quest = new Quest()
      quest.id = await uuidv4()

      const q = request.all()
      q.color = q.color ? q.color : '#505050'
      q.artifact_id = q.artifact_id ? q.artifact_id : 'default-quest-image'

      quest.merge(q)
      quest.author_id = user.id

      await quest.save(trx)
      /*
      await user.quests().attach([quest.id], (row) => {
        row.role = 0
      }, trx)
      */
      trx.commit()

      return response.json(quest)
    } catch (e) {
      trx.rollback()
      console.log(e)

      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ code: e.code, message: e.sqlMessage })
      }
      return response.status(e.status).json({ message: e.message })
    }
  }


  async update ({ params, request, response }) {

    try {

      const q = await Quest.find(params.id)

      if (q != null) {
        q.title = request.input('title')
        q.color = request.input('color')

        await q.save()
        return response.json(q)
      } else return response.status(500).json('quest not found, update failed')
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e })
    }
  }


  async destroy ({ params, response }) {
    const trx = await Database.beginTransaction()
    try {
      const q = await Quest.findBy('id', params.id)

      if (q != null) {
        console.log('===== Deleting quest...')
        console.log(q)
        await q.users().detach()
        await q.cases().detach()
        let artifact = await Artifact.find(q.artifact_id)
        await q.artifact().dissociate()
        try {
          const artifactPath = Helpers.publicPath('/resources/artifacts/quests/') + params.id + '/'

          if (artifact.id === 'default-quest-image') {
            console.log('Cannot delete default quest image...Moving on...')
          } else {
            await artifact.delete(trx)
            await Drive.delete(artifactPath)
          }
        } catch (e) {
          console.log('Error deleting artifact quest')
          console.log(e)
        }
        await q.delete(trx)

        // await c.users().detach()
        // await c.quests().detach()
        // await c.artifacts().delete()
        //
        // await c.delete(trx)

        trx.commit()
        return response.json('Quest deletion successfull')
      } else {
        trx.rollback()
        return response.status(500).json('quest not found')
      }
    } catch (e) {
      console.log('Some error: ' + e)
      trx.rollback()

      console.log(e)
      return response.status(500).json({ message: e })
    }
  }


  async linkUser ({ request, response }) {
    const trx = await Database.beginTransaction()

    try {
      const { userId, questId, permission } = request.post()

      if (permission != 'read' && permission != 'share' && permission != 'write'){
        return response.json('invalid permission')
      }

      const user = await User.find(userId)
      const quest = await Quest.find(questId)

      await user.quests().detach(null, trx)

      if (permission == 'read'){
        if (await user.checkRole('player') || await user.checkRole('author')){
          await user.quests().attach([quest.id], (row) => {
            row.permission = permission
          }, trx)
        }else {
          trx.rollback()
          return response.status(500).json('target user must be an author or a player to be elegible for such permission')
        }
      }

      if (permission == 'write' || permission == 'share'){
        if (await user.checkRole('author')){
          await user.quests().attach([quest.id], (row) => {
            row.permission = permission
          }, trx)
        } else {
          trx.rollback()
          return response.status(500).json('target user must be an author to be elegible for such permission')
        }
      }

      trx.commit()
      return response.json('user and quest successfully linked')
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(500).json(e)
    }
  }

  async linkCase ({ request, response, auth }) {
    try {
      const loggedUser = auth.user
      const { questId, caseId, orderPosition } = request.post()

      // <TODO> Updated to new permission mechanism
      // if (await loggedUser.checkCasePermission(caseId, 'share')){

        const quest = await Quest.find(questId)

        await quest.cases().attach(caseId, (row) => {
          row.order_position = orderPosition
        })

        quest.cases = await quest.cases().fetch()

        return response.json(quest)
      // } else{
      //   return response.status(500).json('you dont have permission to add such case for quests')
      // }
    } catch (e) {
      console.log(e)
      return response.status(500).json(e)
    }
  }

  async listUsers ({ request, response }) {
    try {
      const questId = request.input('questId')

      const quest = await Quest.find(questId)

      return response.json(await quest.users().fetch())
    } catch (e) {
      console.log(e)
      return response.status(500).json(e)
    }
  }


  async listCases ({ request, response }) {
    try {
      const questId = request.input('questId')
      const quest = await Quest.find(questId)

      return response.json(await quest.cases().fetch())
    } catch (e) {
      console.log(e)
    }
  }

  async storeAnnotationsRegular ({request, response, auth}) {
    return await this.storeAnnotations(request.all(), response, auth)
  }

  async storeAnnotationsRoom ({request, response, auth}) {
    const input = request.all()
    let status = await RoomPermissionController.checkPermissions(
      input.room_id, auth.user.id, false, 2)
    let quest
    if (status.error == null) {
      quest = await this.roomQuest(input.room_id)
      status = quest.status
    }
    if (status.error == null) {
      input.quest_id = quest.questId
      return await this.storeAnnotations(input, response, auth)
    } else
      return params.response.status(status.code).json(status.error)
  }

  async insertUpdateAnnotation (annotation, trx) {
    let status = {error: null, code: 0}
    const prp = await Property.find(annotation.property_id)
    if (prp == null)
      status = {error: 'property ' + annotation.property_id + ' not found',
                code: 500}
    else {
      let ann = await QuestAnnotation.findBy(annotation)
        // {quest_id: quest_id, property_id: property_id,
        //  user_id: user_id, fragment: fragment})
      if (ann == null) {
        ann = new QuestAnnotation()
        ann.quest_id = annotation.quest_id
        ann.property_id = annotation.property_id,
        ann.user_id = annotation.user_id
        ann.fragment = annotation.fragment
        ann.count = 1
        await ann.save(trx)
      } else {
        ann.count = ann.count + 1
        await trx
          .table('quest_annotations')
          .where({
            'quest_id': annotation.quest_id,
            'property_id': annotation.property_id,
            'user_id': annotation.user_id,
            'fragment': annotation.fragment
          })
          .update('count', ann.count)
      }
    }
    return status
  }

  async storeAnnotations (input, response, auth) {
    const trx = await Database.beginTransaction()
    try {
      const quest = await this.retrieveQuest(input.quest_id)
      let status = quest.status
      if (status.error == null) {
        const ann = {
          quest_id: input.quest_id,
          property_id: input.property_id || 'dc:description'
        }
        const prp = await Property.find(ann.property_id)
        if (prp == null)
          status = {error: 'property not found', code: 500}
        else if (input.fragment == null && input.multiple == null)
            status = {error: 'fragment or multiple is mandatory', code: 500}
        else {
          ann.user_id = auth.user.id
          if (input.fragment != null) {
            ann.fragment = input.fragment
            status = await this.insertUpdateAnnotation(ann, trx)
          }
          if (status.error == null && input.multiple != null) {
            const multi = JSON.parse(input.multiple)
            for (const m of multi) {
              ann.property_id = m.property_id
              ann.fragment = m.fragment
              status = await this.insertUpdateAnnotation(ann, trx)
              if (status.error != null)
                break
              else
                await ann.save(trx)
            }
          }
        }
      }
      if (status.error == null) {
        trx.commit()
        return response.json('annotation successfully stored')
      } else {
        trx.rollback()
        return response.status(status.code).json(status.message)
      }
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(e.status).json(e.message)
    }
  }

  async roomQuest (roomId, userId) {
    let status = {error: null, code: 0}
    let questId = null
    if (roomId == null)
      status = {error: 'room id is mandatory', code: 500}
    else {
      const room = await Room.find(roomId)
      if (room == null)
        status = {error: 'room not found', code: 500}
      else
        questId = room.quest_id
    }
    return {status: status, questId: questId}
  }

  async listAnnotationsRegular ({request, response, auth}) {
    return await this.listAnnotations(request.input('quest_id'), response, auth)
  }

  async listAnnotationsRoom ({request, response, auth}) {
    const roomId = request.input('room_id')
    let status = await RoomPermissionController.checkPermissions(
      roomId, auth.user.id, false, 1)
    let quest
    if (status.error == null) {
      quest = await this.roomQuest(roomId)
      status = quest.status
    }
    if (status.error == null)
      return await this.listAnnotations(quest.questId, response, auth)
    else
      return response.status(status.code).json(status.error)
  }

  async retrieveQuest (questId) {
    let status = {error: null, code: 0}
    let quest = null
    if (questId == null)
      status = {error: 'quest id is mandatory', code: 500}
    else {
      quest = await Quest.find(questId)
      if (quest == null)
        status = {error: 'quest not found', code: 500}
    }
    return {status: status, quest: quest}
  }

  async listAnnotations (questId, response, auth) {
    try {
      const quest = await this.retrieveQuest(questId)
      return (quest.status.error == null)
        // ? response.json(await quest.quest.annotations().fetch())
        ? await QuestAnnotation
          .query()
          .where('quest_id', questId)
          .where('user_id', auth.user.id)
          .fetch()
        : response.status(quest.status.code).json(quest.status.error)
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({message: e.message})
    }
  }
}

module.exports = QuestController
