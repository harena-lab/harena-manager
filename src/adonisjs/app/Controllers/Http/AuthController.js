'use strict'

const User = use('App/Models/v1/User');

class AuthController {
    async login({ request, auth, response }) {
        let { email, password } = request.all();

        try {
            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email)
                let token = await auth.generate(user)

                Object.assign(user, token)
                return response.json(user)
            }
        }
        catch (e) {
            return response.status(e.status).json({ message: e.message })
        }
    }
}

module.exports = AuthController