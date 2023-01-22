'use strict'

const Database = use('Database')

const Case = use('App/Models/v1/Case')
const Room = use('App/Models/v1/Room')
const Event = use('App/Models/v1/Event')
const Institution = use('App/Models/v1/Institution')
const Role = use('Adonis/Acl/Role')
const Group = use('App/Models/Group')

const uuidv4 = require('uuid/v4')

class EventController {
  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const evt = new Event()
      evt.id = await uuidv4()

      evt.title = request.input('title')
      evt.description = request.input('description')
      evt.start_at = request.input('startAt')
      evt.end_at = request.input('endAt')
      evt.open = request.input('open')
      evt.active = request.input('active')

      const case_id = request.input('caseId')
      let cs = null
      if (case_id != null)
        cs = await Case.find(case_id)
      if (cs != null)
        evt.case_id = cs.id

      const room_id = request.input('roomId')
      let rm = null
      if (room_id != null)
        rm = await Room.find(room_id)
      if (rm != null)
        evt.room_id = rm.id
      evt.room_role = request.input('roomRole') || 1

      const institution_id = request.input('institutionId')
      let it = null
      if (institution_id != null)
        it = await Institution.find(institution_id)
      if (it != null)
        evt.institution_id = it.id

      const role_id = request.input('roleId')
      let rl = null
      if (role_id != null)
        rl = await Role.find(role_id)
      if (rl != null)
        evt.role_id = rl.id

      const group_id = request.input('groupId')
      let gr = null
      if (group_id != null)
        gr = await Group.find(group_id)
      if (gr != null)
        evt.group_id = gr.id

      evt.participants_limit = request.input('participantsLimit')
      evt.younger_age = request.input('youngerAge')
      evt.older_age = request.input('olderAge')
      evt.conference_address = request.input('conferenceAddress')
      evt.term_id = request.input('termId')

		  await evt.save(trx)
      trx.commit()

		  return response.json('event successfully created')
	  } catch (e) {
      trx.rollback()
    	console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  async listEvents ({ request, response}) {
    try {
      const event = await Event.all()
      return response.json(event)
    } catch (e) {
      return response.status(500).json({ message: e.message })
    }
  }

}

module.exports = EventController
