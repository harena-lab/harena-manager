'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const Ticket = use('App/Models/v1/Ticket')

class TicketController {
  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const ticket = new Ticket()

      await ticket.save(trx)
      trx.commit()

      return response.json(ticket)
    } catch (e) {
      trx.rollback()
      console.log(e)

      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ code: e.code, message: e.sqlMessage })
      }
      return response.status(e.status).json({ message: e.message })
    }
  }
}

module.exports = TicketController
