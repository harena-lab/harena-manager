'use strict'

/** @typedef {import('@adonisjs/framework/src/Reroom')} Reroom */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const Helpers = use('Helpers')
const Drive = use('Drive')

const Room = use('App/Models/v1/Room')
const RoomUser = use('App/Models/v1/RoomUser')
const RoomCase = use('App/Models/v1/RoomCase')
const Artifact = use('App/Models/v1/Artifact')
const Quest = use('App/Models/v1/Quest')
const Case = use('App/Models/v1/Case')
const CaseVersion = use('App/Models/v1/CaseVersion')
const User = use('App/Models/v1/User')
const RoomPermissionController =
  use('App/Controllers/Http/v1/RoomPermissionController')

const uuidv4 = require('uuid/v4')

class RoomController {
  async index ({response, auth}) {
    try {
      const rooms = await Room.all()
      return response.json(rooms)
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  async store ({request, response, auth}) {
    const trx = await Database.beginTransaction()
    try {
      const r = request.all()

      let error = null

      const room = new Room()
      room.id = await uuidv4()
      if (r.title != null)
        room.title = r.title
      else
        error = 'title is mandatory'
      if (r.description != null) room.description = r.description
      if (r.artifact_id != null) {
        const art = await Artifact.find(r.artifact_id)
        if (art != null)
          room.artifact_id = r.artifact_id
        else
          error = 'artifact not found'
      }
      if (r.quest_id != null) {
        const qt = await Quest.find(r.quest_id)
        if (qt != null)
          room.quest_id = r.quest_id
        else
          error = 'quest not found'
      }

      if (error == null) {
        await room.save(trx)
        trx.commit()
        return response.json(room)
      } else {
        trx.rollback()
        return response.status(500).json(error + ', creation failed')
      }
    } catch (e) {
      trx.rollback()
      if (e.code === 'ER_DUP_ENTRY')
        return response.status(409).json({ code: e.code, message: e.sqlMessage })
      else
        return response.status(e.status).json({ message: e.message })
    }
  }

  async linkUser ({request, response}) {
    const trx = await Database.beginTransaction()
    try {
      const r = request.all()
      let error = null
      if (r.user_id == null)
        error = 'user id is mandatory'
      else {
        const user = await User.find(r.user_id)
        if (user == null)
          error = 'user not found'
        else {
          if (r.room_id == null)
            error = 'room id is mandatory'
          else {
            const room = await Room.find(r.room_id)
            if (room == null)
              error = 'room not found'
            }
        }
      }
      if (error == null) {
        const room = new RoomUser()
        room.user_id = r.user_id
        room.room_id = r.room_id
        room.role = (r.role != null) ? r.role : 1
        await room.save(trx)
        trx.commit()
        return response.json('room and user successfully linked')
      } else {
        trx.rollback()
        return response.status(500).json(error + ', link failed')
      }
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(500).json(e)
    }
  }

  /**
  * Display a link between a room and a user.
  * GET room/user
  */

  async userRoleRegular ({request, response, auth}) {
    return this.userRole(request, response, auth.user.id, false)
  }

  async userRoleAdmin ({request, response, auth}) {
    return this.userRole(
      request, response, request.input('user_id'), true)
  }

  async userRole (request, response, userId, admin) {
    const us = await RoomPermissionController.checkUserRole(
      request.input('room_id'), userId, admin)
    return (us.error == null)
      ? response.json(us) : response.status(us.status).json(us.error)
  }

  async listUsers ({request, response}) {
    try {
      const roomId = request.input('room_id')
      let error = null
      let roomUsers
      if (roomId == null)
        error = 'room id is mandatory'
      else {
        roomUsers = await Database
          .select(['users.id', 'users.username'])
          .from('room_users')
          .join('users', 'room_users.user_id', '=', 'users.id')
          .where('room_users.room_id', roomId)
        if (roomUsers.length == 0) {
          const room = await Room.find(roomId)
          if (room == null)
            error = 'room not found'
        }
      }
      return (error == null)
        ? response.json(roomUsers) : response.status(500).json(error)
    } catch (e) {
      console.log(e)
      return response.status(e.status).json(e.message)
    }
  }

  async linkCase ({request, response}) {
    const trx = await Database.beginTransaction()
    try {
      const r = request.all()
      let error = null
      if (r.case_id == null)
        error = 'case id is mandatory'
      else {
        const cs = await Case.find(r.case_id)
        if (cs == null)
          error = 'case not found'
        else {
          if (r.room_id == null)
            error = 'room id is mandatory'
          else {
            const room = await Room.find(r.room_id)
            if (room == null)
              error = 'room not found'
            }
        }
      }
      if (error == null) {
        const room = new RoomCase()
        room.case_id = r.case_id
        room.room_id = r.room_id
        await room.save(trx)
        trx.commit()
        return response.json('room and case successfully linked')
      } else {
        trx.rollback()
        return response.status(500).json(error + ', link failed')
      }
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(e.status).json(e.message)
    }
  }

  async listCasesRegular ({request, response, auth}) {
    return await this.listCases(request, response, auth.user.id, false)
  }

  async listCasesAdmin ({request, response, auth}) {
    return await this.listCases(request, response, null, true)
  }

  async listCases (request, response, userId, admin) {
    try {
      const roomId = request.input('room_id')
      let status =
        await RoomPermissionController.checkPermissions(roomId, userId, admin, 1)

      let roomCases
      if (status.error == null) {
        roomCases = await Database
          .select(['cases.id', 'cases.title'])
          .from('room_cases')
          .join('cases', 'room_cases.case_id', '=', 'cases.id')
          .where('room_cases.room_id', roomId)
        if (roomCases.length == 0 && admin) {
          const room = await Room.find(roomId)
          if (room == null)
            status = {error: 'room not found', code: 500}
        }
      }
      return (status.error == null)
        ? response.json(roomCases)
        : response.status(status.code).json(status.error)
    } catch (e) {
      return response.status(e.status).json(e.message)
    }
  }

  async listCasesQuestRegular ({request, response, auth}) {
    return await this.listCasesQuest(request, response, auth.user.id, false)
  }

  async listCasesQuestAdmin ({request, response, auth}) {
    return await this.listCasesQuest(request, response, null, true)
  }

  async listCasesQuest (request, response, userId, admin) {
    try {
      const roomId = request.input('room_id')
      let status =
        await RoomPermissionController.checkPermissions(roomId, userId, admin, 1)

      let room
      if (status.error == null) {
        room = await Room.find(roomId)
        if (room == null)
          status = {error: 'room not found', code: 500}
        else if (room.quest_id == null)
          status = {error: 'room is not linked to a quest', code: 500}
      }

      let roomCases
      if (status.error == null) {
        roomCases = await Database
          .select(['quests_cases.order_position', 'cases.id', 'cases.title'])
          .from('room_cases')
          .join('cases', 'room_cases.case_id', '=', 'cases.id')
          .join('quests_cases', 'cases.id', '=', 'quests_cases.case_id')
          .where('room_cases.room_id', roomId)
          .where('quests_cases.quest_id', room.quest_id)
      }
      return (status.error == null)
        ? response.json(roomCases)
        : response.status(status.code).json(status.error)
    } catch (e) {
      return response.status(e.status).json(e.message)
    }
  }

  async update ({ params, request, response }) {

    try {
      const q = await Room.find(params.id)

      if (q != null) {
        q.title = request.input('title')
        q.color = request.input('color')

        await q.save()
        return response.json(q)
      } else return response.status(500).json('room not found, update failed')
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e })
    }
  }


  async destroy ({ params, response }) {
    const trx = await Database.beginTransaction()
    try {
      const q = await Room.findBy('id', params.id)

      if (q != null) {
        console.log('===== Deleting room...')
        console.log(q)
        await q.users().detach()
        await q.cases().detach()
        let artifact = await Artifact.find(q.artifact_id)
        await q.artifact().dissociate()
        try {
          const artifactPath = Helpers.publicPath('/resources/artifacts/rooms/') + params.id + '/'

          if (artifact.id === 'default-room-image') {
            console.log('Cannot delete default room image...Moving on...')
          } else {
            await artifact.delete(trx)
            await Drive.delete(artifactPath)
          }
        } catch (e) {
          console.log('Error deleting artifact room')
          console.log(e)
        }
        await q.delete(trx)

        // await c.users().detach()
        // await c.rooms().detach()
        // await c.artifacts().delete()
        //
        // await c.delete(trx)

        trx.commit()
        return response.json('Room deletion successfull')
      } else {
        trx.rollback()
        return response.status(500).json('room not found')
      }
    } catch (e) {
      console.log('Some error: ' + e)
      trx.rollback()

      console.log(e)
      return response.status(500).json({ message: e })
    }
  }
}

module.exports = RoomController
