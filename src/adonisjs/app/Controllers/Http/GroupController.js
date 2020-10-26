'use strict'

const Group = use('App/Models/Group')
const User = use('App/Models/v1/User')

const Database = use('Database')
const uuidv4 = require('uuid/v4')

class GroupController {

  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {

      const group = new Group()
      group.id = await uuidv4()
      group.title = request.input('title')

      await group.save(trx)

      trx.commit()

      return response.json(group)
    } catch (e) {
      trx.rollback()
      console.log(e)

      return response.status(e.status).json({ message: e.message })
    }
  }


  async linkUser ({ request, auth, response }) {
    try {
      const { userId, groupId } = request.post()

      const user = await User.find(userId)

      await user.groups().attach(groupId)

      return response.json('user successfully added to the group')
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }


  async listCases ({ request, response }) {
    try {
      const groupId = request.input('groupId')

      const result = await Database
        .select([ 'cases.id', 'cases.title','description', 'users.username'])
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.case_id')
        .where('entity', 'group')
        .where('subject', groupId)
        .where('clearance', 'read')
        .leftJoin('users_cases', 'cases.id', 'users_cases.case_id')
        .leftJoin('users', 'users.id', 'users_cases.user_id')

      return response.json(result)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = GroupController
