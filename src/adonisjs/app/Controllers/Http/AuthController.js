'use strict'

const User = use('App/Models/v1/User');

class AuthController {
    async login({ request, auth, response }) {
        let { email, password } = request.all();

        try {
            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email)
                let token = await auth.generate(user)
                
                let authenticatedUser = new User()
                authenticatedUser.email = user.email
                authenticatedUser.username = user.username

                Object.assign(authenticatedUser, token)
                return response.json(authenticatedUser)
            }
        }
        catch (e) {
            console.log(e)
            return response.status(e.status).json({ message: e.message })
        }
    }
}

module.exports = AuthController