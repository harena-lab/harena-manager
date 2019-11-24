'use strict'

const Quest = use('App/Models/v1/Quest');

class QuestController {

    /**
     * Create/Update quest.
     * PUT quest/:mame
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ params, response, auth }) {
        try {
            // let newUser = request.all()
            print('nooooo')
            // let quest = await Quest.find(params.name)
            //
            // await quest.merge(quest)
            // await quest.save()
            //
            // return response.json(quest)
            return 'aqui'
        } catch (e) {
            return response.status(e.status).json({ message: e.message })
        }
    }

}

module.exports = QuestController
