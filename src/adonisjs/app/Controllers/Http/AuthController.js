'use strict'

const User = use('App/Models/v1/User');
const Token = use('App/Models/v1/Token');

class AuthController {

	async login({ request, auth, response }) {
console.log(2)
        let { email, password, refresh_token } = request.all();
        let user = ""
        let token = ""
            
        try{
            await auth.check()
            return response.json('user is signed already')
        } catch(e) {
            console.log(e)
            // token expired
            if (e.code == 'E_JWT_TOKEN_EXPIRED'){
                token = await auth.generateForRefreshToken(refresh_token)

                Object.entries(token).forEach(entry => {
                    if (entry[0] == 'refreshToken'){
                        refresh_token = entry[1]
                    }
                }); 
            }

            // unloged user
            if (e.code == 'E_INVALID_JWT_TOKEN')
                token = await auth.withRefreshToken().attempt(email, password)

            // generic error
            if (token == "")
                return response.status(e.status).json(e.message)

            user = await User.findBy('email', email)
            Object.assign(user, token)

            return response.json(user)
        }
    }

    async login2({ request, auth, response }) {
        try{
            let refresh_token  = request.input('access_code');

            let token = await auth.generateForRefreshToken(refresh_token)
            return response.json(token)
        }catch(e){
            console.log(e)
            return response.status(500).json(e.message)
        }
        
    }

    async logout({ auth, response }) {
        try{

            const refreshToken = auth.getAuthHeader()
            await auth.revokeTokens(refreshToken)
            
            return response.json('successfull logout')
        }catch(e){
            console.log(e)
            return response.status(500).json(e.message)
        }
        
    }
}

module.exports = AuthController
