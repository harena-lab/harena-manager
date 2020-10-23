'use strict'

const Group = use('App/Models/Group')

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


  async linkUsers ({ request, auth, response }) {
    const trx = await Database.beginTransaction()
    // console.log(request.all())
    try {
    //   const loggedUser = auth.user.id
      const { usersId, groupId } = request.post()
      console.log(usersId)
    //
    //   if (permission != 'read' && permission != 'share' && permission != 'write'){
    //     return response.json('invalid permission')
    //   }
    //
    //   if (loggedUser == userId) {
    //     return response.status(500).json('cannot share a case with herself')
    //   }
    //
    //   const user = await User.find(userId)
    //
    //   await user.cases().detach(null, trx)
    //
    //   if (permission == 'read'){
    //     if (await user.checkRole('player') || await user.checkRole('author')){
    //       await user.cases().attach(caseId, (row) => {
    //         row.permission = permission
    //       }, trx)
    //     }else {
    //       return response.status(500).json('target user must be an author or a player to be elegible for such permission')
    //     }
    //
    //   }
    //
    //   if (permission == 'write' || permission == 'share'){
    //     // Check if target user is an author
    //     if (await user.checkRole('author')){
    //
    //       await user.cases().attach(caseId, (row) => {
    //         row.permission = permission
    //       }, trx)
    //
    //     } else {
    //       return response.status(500).json('target user must be an author to be elegible for such permission')
    //     }
    //   }
    //   trx.commit()
      return response.json('user and case successfully linked')
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }
}

module.exports = GroupController
