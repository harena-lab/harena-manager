'use strict'


const Route   = use('Route')

/*
|----------------------------------------------------------------------------------------------
|  index                                                   
|----------------------------------------------------------------------------------------------
*/
Route.get('/', () => { return 'Hello from Harena Manager'} )


/*
|----------------------------------------------------------------------------------------------
|       api: v1                                                   
|  resource: /user
|----------------------------------------------------------------------------------------------
*/

Route.group(() => { 

	Route.post(	 '',		 		'v1/UserController.store')
	// Route.post(	 'login',			'v1/AuthController.login') 

	
    Route.get( 	 'cases',        	'v1/UserController.list_cases').middleware(['auth'])  
	Route.get(   'quests',  		'v1/UserController.list_quests').middleware(['auth'])
	Route.get(   'cases_by_quest', 	'v1/UserController.list_cases_by_quests').middleware(['auth'])

	Route.get(   ':id',             'v1/UserController.show').middleware(['auth']) 
    Route.put(   ':id',             'v1/UserController.update').middleware(['auth'])
    Route.delete(':id',             'v1/UserController.destroy').middleware(['auth'])

}).prefix('/api/v1/user')

Route.get('/api/v1/users',          'v1/UserController.index').middleware(['auth', 'is:admin'])


Route.post('/api/v1/auth/login',			'v1/AuthController.login') 
Route.post('/api/v1/auth/logout',			'v1/AuthController.logout').middleware(['auth'])

/*
|----------------------------------------------------------------------------------------------
|       api: v2                                                   
|  resource: /auth
|----------------------------------------------------------------------------------------------
*/
Route.group(() => { 
    Route.post('login',		'AuthController.login') 
	Route.post('logout', 	'AuthController.logout').middleware(['auth'])

}).prefix('/api/v2/auth')






/*
|----------------------------------------------------------------------------------------------
|       api: v1                                                   
|  resource: /case
|----------------------------------------------------------------------------------------------
*/

Route.group(() => {

	Route.get( 	 '',            'v1/CaseController.index')
	Route.get(   ':id',         'v1/CaseController.show') 
	Route.post(  '',			'v1/CaseController.store')
	Route.put(   ':id',         'v1/CaseController.update').middleware(['check_permission:contributor'])
	Route.post(  'share',       'v1/CaseController.share').middleware(['check_permission:author'])
	Route.delete(':id',         'v1/CaseController.destroy').middleware(['check_permission:author'])

}).prefix('/api/v1/case').middleware(['auth', 'is:author'])



/*
|----------------------------------------------------------------------------------------------
|       api: v1                                                   
|  resource: /artifacts
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	
	Route.post(  '',                    'v1/ArtifactController.store')
	
}).prefix('/api/v1/artifact/').middleware(['auth:jwt', 'is:author'])

/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /quest
|----------------------------------------------------------------------------------------------
*/
Route.get('/api/v1/player/quests',     		'v1/UserController.listPlayingQuests').middleware('auth', 'is:(player)')
Route.get('/api/v1/author/quest/cases', 			'v1/QuestController.listCases').middleware('auth', 'is:author', 'quest_permission:contributor')
// Route.get('/api/v1/quest/cases', 			'v1/QuestController.listCases').middleware(['auth', 'is:(author or player)', 'quest_permission'])

Route.group(() => {
	Route.get(   'users',      		'v1/QuestController.listUsers').middleware('quest_permission:contributor')

	Route.post(   '',             	'v1/QuestController.store')

	Route.post(  'link/user',		'v1/QuestController.linkUser').middleware('quest_permission:contributor')
	Route.post(  'link/case',		'v1/QuestController.linkCase').middleware('quest_permission:contributor')
}).prefix('/api/v1/quest').middleware('auth', 'is:author')


/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /admin
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	Route.get(   'roles',               	'v1/AdminController.list_roles')
	Route.post(  'role',             		'v1/AdminController.create_role')
	Route.post(  'role/link/permission',	'v1/AdminController.link_role_permission')

	Route.get(   'user/:id/roles',		  	'v1/AdminController.list_roles_by_user')
	Route.post(  'user/link/role',			'v1/AdminController.linkRoleUser')


	Route.get(	 'quests',     				'v1/QuestController.index')
	Route.post(  'quest/link/user',			'v1/QuestController.linkUser')


	Route.post(   'institution',       		'v1/InstitutionController.store')

	Route.post(   'revoke_tokens',     		'v1/AdminController.revoke_tokens')
}).prefix('/api/v1/admin').middleware(['auth', 'is:admin'])




/* Test route */
Route.get('/api/imagetest', 	'TestController.index')
Route.post('/', 				'TestController.create').as('profile');
