'use strict'

const User = use('App/Models/v1/User');
const CaseVersion = use('App/Models/v1/CaseVersion');

class SuggestionController {
    async store({ request, response }) {
        try {
            const {user_id, case_version_id} = request.post()
            let user = await User.find(user_id)
            let cv = await CaseVersion.find(case_version_id)

            await user.suggested_cases().attach(cv.id)
            user.suggested_cases = await user.suggested_cases().fetch()
            return response.json(user)
        } catch (e) {
            console.log(e)
            if (e.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({message: e.message})
            }

            return response.status(e.status).json({message: e.message})
        }
    }
}

module.exports = SuggestionController
