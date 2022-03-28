'use strict'

const Database = use('Database')
const Term = use('App/Models/v1/Term')
const User = use('App/Models/v1/User')
const UsersTerm = use('App/Models/v1/UsersTerm')

class TermController {

  async listTerms ({ request, response}) {
    try {
      const cases = await Term.all()
      return response.json(cases)
    } catch (e) {
      return response.status(500).json({ message: e.message })
    }
  }
  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const term = new Term()
      term.id = request.input('id')
      term.title = request.input('title')
      term.adult_term = request.input('adultTerm')
      term.child_term = request.input('childTerm')
      term.image_capture = request.input('imageCapture')
      term.video_capture = request.input('videoCapture')

		  await term.save(trx)
      trx.commit()

		  response.json('term successfully created')
	  } catch (e) {
      trx.rollback()
    	console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  async linkUser ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      console.log('=== linking user')
      console.log(request.input('userId'))
      console.log(request.input('termId'))

      const term = new UsersTerm()

      const user_id = request.input('userId')
      let us = null
      if (user_id != null)
        us = await User.find(user_id)
      if (us != null)
        term.user_id = us.id

      const term_id = request.input('termId')
      let tr = null
      if (term_id != null)
        tr = await Term.find(term_id)
      if (tr != null)
        term.term_id = tr.id

      term.name_responsible = request.input('nameResponsible')
      term.email_responsible = request.input('emailResponsible')
      term.name_participant = request.input('nameParticipant')
      term.date = request.input('date')
      term.role = request.input('role')
      term.agree = request.input('agree')

		  await term.save(trx)
      trx.commit()

		  response.json({message: 'term successfully related to user'})
	  } catch (e) {
      trx.rollback()
    	console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  /**
  * Display a link between a term and a user.
  * GET term/user
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async showTermUser ({ params, request, response, view, auth }) {
    try {
      let userId = request.input('userId')
      if (userId == null)
        userId = auth.user.id
      const uterm = await Database
        .select('*')
        .from('users_terms')
        .where('user_id', userId)
        .where('term_id', request.input('termId'))
      if (uterm != null)
        return response.json(uterm)
      else
        return response.status(500).json('user not found')
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }

  /**
  * List all term and users.
  * GET term/users
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async listTermUsers ({ params, request, response, view }) {
    try {
      const uterm = await Database
        .select('*')
        .from('users_terms')
        .where('term_id', request.input('termId'))
      if (uterm != null)
        return response.json(uterm)
      else
        return response.status(500).json('user not found')
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }
}

module.exports = TermController
