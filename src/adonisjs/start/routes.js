'use strict'


const Route   = use('Route')

/*
|----------------------------------------------------------------------------------------------
|  index                                                   
|----------------------------------------------------------------------------------------------
*/
Route.get('/', () => { return 'Hello from the harena-manager'} )


/*
|----------------------------------------------------------------------------------------------
|       api: v1                                                   
|  resource: /user
|----------------------------------------------------------------------------------------------
*/
Route.post('/api/v1/user/register',                 'v1/UserController.store')
Route.post('/api/v1/user/login',                    'v1/AuthController.login') 
Route.post('/api/v2/user/login',                    'AuthController.login') 

Route.post('/api/v2/user/logout',                   'AuthController.logout')
	.middleware(['auth']) 

Route.group(() => { 
                    Route.get(   '',                'v1/UserController.index')
                    Route.get(   ':id',             'v1/UserController.show') 
                    Route.put(   ':id',             'v1/UserController.update')
                    Route.delete(':id',             'v1/UserController.destroy')
					Route.get(   ':id/quests',  	'v1/UserController.list_quests')
					Route.get( 	 ':id/case',        'v1/UserController.list_cases')  

}).prefix('/api/v1/user').middleware(['auth', 'is:admin'])



/*
|----------------------------------------------------------------------------------------------
|       api: v1                                                   
|  resource: /case
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	
	Route.get( 	 '',            'v1/CaseController.index')
	Route.get(   ':id',         'v1/CaseController.show') 
	Route.post(  'register',	'v1/CaseController.store')
	Route.put(   ':id',         'v1/CaseController.update')
	Route.delete(':id',         'v1/CaseController.destroy')
	Route.post(  'share',       'v1/CaseController.share')

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
Route.group(() => {
	Route.get(   '',     			'v1/QuestController.index')
	Route.put(   '',             	'v1/QuestController.store')

	Route.post(  'link/user',		'v1/QuestController.link_user')
	Route.post(  'link/case',		'v1/QuestController.link_case')
	Route.get(   ':id/users',      	'v1/QuestController.list_users')
	Route.get(   ':id/cases',      	'v1/QuestController.list_cases')

}).prefix('/api/v1/quest').middleware('auth', 'is:administrator')


/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /admin
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	Route.put(   'role',             		'v1/AdminController.create_role')
	Route.put(   'permission',        		'v1/AdminController.create_permission')
	Route.get(   'roles',               	'v1/AdminController.list_roles')
	Route.get(   'permissions',             'v1/AdminController.list_permissions')

	Route.post(  'role/link/user',			'v1/AdminController.link_role_user')
	Route.post(  'role/link/permission',	'v1/AdminController.link_role_permission')

	Route.get(   'user/:id/roles',		  	'v1/AdminController.list_roles_by_user')
	Route.get(   'role/:id/permissions',	'v1/AdminController.list_permissions_by_role')
	Route.get(   'user/:id/permissions',	'v1/AdminController.list_permissions_by_user')

}).prefix('/api/v1/admin').middleware(['auth', 'is:admin'])




/* Test route */
Route.get('/api/imagetest', 	'TestController.index')
Route.post('/', 				'TestController.create').as('profile');
