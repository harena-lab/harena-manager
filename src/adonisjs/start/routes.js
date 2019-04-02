'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.on('/').render('welcome')

Route.get('/', () => { return 'Hello from the Harena\'s casemanager'} )

Route.group(() => {
	Route.put(':id', 'v1/CaseController.update')
	Route.delete('id', 'v1/CaseController.destroy')
	Route.post('', 'v1/CaseController.store')
	Route.get('', 'v1/CaseController.index') 
}).prefix('/api/v1/cases/').middleware('auth')

Route.group(() => {
	Route.post('register', 'AuthController.register')
	Route.post('login', 'AuthController.login') 
	Route.get('logout', 'AuthController.logout') 
	Route.put('users/:id', 'AuthController.update')
}).prefix('/auth')