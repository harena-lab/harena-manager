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
    async update({ params, request, response, auth }) {
        try {
            // let newUser = request.all()

            let quest = await Quest.find(params.name)

            await quest.merge(quest)
            await quest.save()

            return response.json(quest)
        } catch (e) {
            return response.status(e.status).json({ message: e.message })
        }
    }

}

module.exports = QuestController
