'use strict'

const User = use('App/Models/v1/User');
const Token = use('App/Models/v1/Token');

class AuthController {

	async login1({ request, auth, response }) {

        try {
            let { email, password } = request.all();

            let token = await auth.withRefreshToken().attempt(email, password)
            
            let refresh_token = ""
            Object.entries(token).forEach(entry => {
                if (entry[0] == 'refreshToken'){
                    refresh_token = entry[1]
                }
            });
            return response.json({'access_code':refresh_token })
        } catch (e) {
            console.log(e)
            return response.status(e.status).json(e.message)
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
