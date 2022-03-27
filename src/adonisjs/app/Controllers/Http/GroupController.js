'use strict'

const Group = use('App/Models/Group')
const User = use('App/Models/v1/User')
const UsersGroup = use('App/Models/v1/UsersGroup')
const ManagersGroup = use('App/Models/v1/ManagersGroup')

const Database = use('Database')
const uuidv4 = require('uuid/v4')

class GroupController {

  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {

      const group = new Group()
      group.id = await uuidv4()
      group.title = request.input('title')

      await group.save(trx)

      trx.commit()

      const user = await User.find(auth.user.id)
      await user.groups().attach(group.id)

      return response.json(group)
    } catch (e) {
      trx.rollback()
      console.log(e)

      return response.status(e.status).json({ message: e.message })
    }
  }

  async canManageGroup (user, groupId) {
    let canManage = await ManagersGroup
      .query()
      .where('user_id', user.id)
      .where('group_id', groupId)
      .first()

    if (!canManage) {
      const roles = (await user.roles().fetch()).toJSON()
      for (const r of roles)
        if (r.slug == 'admin')
          canManage = true
    }

    return canManage
  }

  async linkUser ({ request, auth, response }) {
    try {
      const { userId, groupId } = request.post()
      const user = await User.find(userId)

      const canManage = await this.canManageGroup(auth.user, groupId)

      if (canManage && user) {
        await user.groups().attach(groupId)
        return response.json(user.username + ' successfully added to the group!')
      } else if (!canManage) {
        return response.status(500).json(
          'Error. You must have the right to be able to add another user.')
      } else {
        return response.status(500).json(
          'Error. Could not find the user to be added into the group.')
      }

    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }

  async linkManager ({ request, auth, response }) {
    try {
      const { userId, groupId } = request.post()
      const user = await User.find(userId)
      const canManage = await this.canManageGroup(auth.user, groupId)

      if (canManage && user) {
        await user.groupManagers().attach(groupId)
        return response.json(user.username +
          ' successfully added as manager to the group!')
      } else if (!canManage) {
        return response.status(500).json(
          'Error. You must have the right to be able to add another manager.')
      } else {
        return response.status(500)
          .json('Error. Could not find the user to be added into the group.')
      }

    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }

  async listCases ({ request, response, auth }) {
    try {
      const groupId = request.input('groupId')
      if(await Group.find(groupId)){
        var itemOffset = 0
        const itemLimit = request.input('nItems') || 20
        if (request.input('page') && request.input('page') < 1)
          itemOffset = 0
        else
          itemOffset = request.input('page') - 1 || 0

        var totalPages = null

        let countCases = await Database
          .from('cases')
          .leftJoin('permissions', 'cases.id', 'permissions.table_id')
          .leftJoin('users_groups', function() {
            this.on('permissions.subject', '=', 'users_groups.group_id')
          })
          .join('users', 'cases.author_id','users.id')
          .join('institutions', 'users.institution_id', 'institutions.id')
          .where('permissions.entity', 'group')
          .where('permissions.subject', groupId)
          .countDistinct('cases.id as cases')


        totalPages = Math.ceil(countCases[0]['cases'] / itemLimit)

        if(itemOffset >= totalPages)
          itemOffset = 0

        const result = await Database
          .select([ 'cases.id', 'cases.title','cases.description', 'cases.language', 'cases.domain',
          'cases.specialty', 'cases.keywords', 'cases.complexity', 'cases.original_date',
          'cases.author_grade', 'cases.published', 'users.username',
          'institutions.title AS institution', 'institutions.acronym AS institution_acronym',
          'institutions.country AS institution_country', 'cases.created_at'])
          .distinct('cases.id')
          .from('cases')
          .leftJoin('permissions', 'cases.id', 'permissions.table_id')
          .leftJoin('users_groups', function() {
            this.on('permissions.subject', '=', 'users_groups.group_id')
          })
          .join('users', 'cases.author_id','users.id')
          .join('institutions', 'users.institution_id', 'institutions.id')
          .where('permissions.entity', 'group')
          .where('permissions.subject', groupId)
          .orderBy('cases.created_at', 'desc')
          .offset(itemOffset * itemLimit)
          .limit(itemLimit)


        return response.json(result)
      }else{
        return response.status(500).json('Error. Could not find selected group.')
      }

    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }

  async listUsers ({ request, auth, response }) {
    try {
      const groupId = request.input('groupId')

      const canManage = await this.canManageGroup(auth.user, groupId)

      if (canManage && await Group.find(groupId)) {
        const result = await Database
          .select('users.username','user_id','group_id','groups.title as group_title')
          .from('users_groups')
          .join('groups','users_groups.group_id','groups.id')
          .join('users', 'users_groups.user_id', 'users.id')
          .where ('users_groups.group_id', groupId)

        return response.json(result)
      } else if (!canManage) {
        return response.status(500).json(
          'Error. You must have the right to be able to list group users.')
      } else {
        return response.status(500).json('Error. Could not find selected group.')
      }
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }

  async listManagers ({ request, auth, response }) {
    try {
      const groupId = request.input('groupId')

      const canManage = await this.canManageGroup(auth.user, groupId)

      if (canManage && await Group.find(groupId)) {
        const result = await Database
          .select('users.username','user_id','group_id','groups.title as group_title')
          .from('managers_groups')
          .join('groups','managers_groups.group_id','groups.id')
          .join('users', 'managers_groups.user_id', 'users.id')
          .where ('managers_groups.group_id', groupId)

        return response.json(result)
      } else if (!canManage) {
        return response.status(500).json(
          'Error. You must have the right to be able to list group managers.')
      } else {
        return response.status(500).json('Error. Could not find selected group.')
      }
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }

  async removeUser ({ request, auth, response }){
    try {
      const userId = request.input('userId')
      const groupId = request.input('groupId')
      const user = await User.find(userId)

      const canRemoveUser = await UsersGroup
        .query()
        .where('user_id', auth.user.id)
        .where('group_id', groupId)
        .first()
      const isInGroup = await UsersGroup
        .query()
        .where('user_id', user.id)
        .where('group_id', groupId)
        .first()
      if(canRemoveUser && user && isInGroup){
        await user.groups().detach(groupId)
        return response.json(user.username + ' successfully removed from the group!')
      }else if(!canRemoveUser){
        return response.status(500).json('Error. You must be part of the group to be able to remove another user.')
      }else{
        return response.status(500).json('Error. Could not find the user to be removed from the group.')
      }
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }

  async listGroups ({request, auth, response}){

    try {
      const groupId = request.input('groupId')

      const result = await Database
        .select('group_id','groups.title as group_title')
        .from('users_groups')
        .join('groups','users_groups.group_id','groups.id')
        .where ('users_groups.user_id', auth.user.id)

      return response.json(result)
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }
}

module.exports = GroupController
