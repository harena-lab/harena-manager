'use strict'

const Route = use('Route')
const Env   = use('Env')

Route.get('/', () => {  return 'Hello from the jacinto-casemanager'} )


/*
    v1 routes
*/


Route.group(() => {

					Route.post('login',        'v1/AuthController.login')
					Route.post('token/create', 'v1/AuthController.tokenCreate')
					Route.get( 'token/list'  , 'v1/AuthController.tokenCreate')

	              }).prefix('api/v1/auth').middleware([])


Route.group(() => {



	              }).prefix('api/v1').middleware([])


// Route.post('login', 'v1/UserController.login')





Route.get('users/:id', 'UserController.show').middleware('auth')