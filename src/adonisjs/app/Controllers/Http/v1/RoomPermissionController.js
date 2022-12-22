'use strict'

const Database = use('Database')
const Room = use('App/Models/v1/Room')
const User = use('App/Models/v1/User')

class RoomPermissionController {
  static async checkUserRole (roomId, userId, admin) {
    try {
      let error = null
      let roomUser
      if (userId == null)
        error = 'user id is mandatory'
      else if (roomId == null)
        error = 'room id is mandatory'
      else {
        roomUser = await Database
          .select(['role', 'created_at'])
          .from('room_users')
          .where('user_id', userId)
          .where('room_id', roomId)
        if (roomUser.length == 0) {
          const room = await Room.find(roomId)
          if (room == null)
            error = 'room not found'
          else if (admin) {
            const user = await User.find(userId)
            if (user == null)
              error = 'user not found'
          }
        }
      }
      if (error == null) {
        if (roomUser.length == 0) roomUser = [{role: 0, created_at: null}]
        return roomUser[0]
      } else {
        return {error: error, status: 500}
      }
    } catch (e) {
      return {error: e.message, status: e.status}
    }
  }

  /*
   * Check permissions in the room
   * <TODO> unify permission system
   * - clearance: 0 - none; 1 - read; 2 - annotate; 3 - write
   */
  static async checkPermissions (roomId, userId, admin, clearance) {
    let status = {error: null, code: 0}
    if (roomId == null)
      status = {error: 'room id is mandatory', code: 500}
    else if (admin) {
      const room = await Room.find(roomId)
      if (room == null)
        status = {error: 'room not found', code: 500}
    } else {
      const us = await this.checkUserRole(roomId, userId, admin)
      if (us.error != null)
        status = {error: us.error, code: us.status}
      else if (us.role < clearance)
        status = {error: 'insufficient permissions', code: 500}
    }
    return status
  }

}

module.exports = RoomPermissionController
