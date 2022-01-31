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
    Route.post(	 '',		                  'v1/UserController.store')
    Route.post(	 'self',                  'v1/UserController.storeSelf')
    Route.post(	 'property',		          'v1/UserController.storeProperty').middleware(['auth'])

    Route.get(	 'cases',                 'v1/UserController.listCases').middleware(['auth'])
    Route.get(   'quests',  	            'v1/UserController.list_quests').middleware(['auth'])
    Route.get(   'cases_by_quest',        'v1/UserController.list_cases_by_quests').middleware(['auth'])
    Route.get(   'property',              'v1/UserController.listProperties').middleware(['auth'])
    Route.get(   ':id',                   'v1/UserController.show').middleware(['auth'])

    Route.put(   'password',              'v1/UserController.updatePassword').middleware(['auth'])
    Route.put(   '',                      'v1/UserController.update').middleware(['auth'])
    Route.put(   'property',              'v1/UserController.updateProperty').middleware(['auth'])

    Route.delete(':id',                   'v1/UserController.destroy').middleware(['auth'])
}).prefix('/api/v1/user')


/*
|----------------------------------------------------------------------------------------------
|  Authentication via Sessions to harena-space calls
|  api: v1
|  resource: /auth
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	Route.post('login',			'v1/AuthController.login')
	Route.post('logout',		'v1/AuthController.logout').middleware(['auth'])
	Route.get('check',			'v1/AuthController.checkToken')
}).prefix('/api/v1/auth')


/*
|----------------------------------------------------------------------------------------------
|  Authentication via JWT to api calls
|  api: v2
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
	Route.post(  '',	          'v1/CaseController.store')
	Route.put(   '',         'v1/CaseController.update').middleware(['case_permission:write'])
	Route.delete('',         'v1/CaseController.destroy').middleware(['case_permission:delete'])
  Route.post('share',         'v1/CaseController.share').middleware(['case_permission:share'])

  Route.post('property',      'v1/CaseController.storeProperty').middleware(['auth', 'case_permission:write'])
  Route.put('property',      'v1/CaseController.updateProperty').middleware(['auth', 'case_permission:write'])
}).prefix('/api/v1/case').middleware(['auth', 'is:author'])
Route.get(   '/api/v1/case',         'v1/CaseController.show').middleware(['auth', 'case_permission:read'])


/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /artifact
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	Route.post(  '',            'v1/ArtifactController.store')
  Route.delete(':id',         'v1/ArtifactController.destroy')
  Route.get('list',          'v1/ArtifactController.list')
}).prefix('/api/v1/artifact/').middleware(['auth', 'is:author'])


/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /author
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	Route.get('quests',     			'v1/UserController.listContributingQuests').middleware('auth')
	Route.get('quest/cases', 			'v1/QuestController.listCases').middleware('auth', 'quest_permission:read')
}).prefix('/api/v1/author').middleware('auth', 'is:author')


/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /player
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	Route.get('quests',     		'v1/UserController.listPlayingQuests').middleware('auth')
	Route.get('quest/cases',		'v1/QuestController.listCases').middleware('auth', 'quest_permission:read')
}).prefix('/api/v1/player').middleware('auth', 'is:player')


/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /quest
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	Route.get(   'users',      	'v1/QuestController.listUsers').middleware('quest_permission:delete')

	Route.post(   '',           'v1/QuestController.store')

	Route.post(  'link/user',		'v1/QuestController.linkUser').middleware('quest_permission:share')
	Route.post(  'link/case',		'v1/QuestController.linkCase').middleware('quest_permission:write')
}).prefix('/api/v1/quest').middleware('auth', 'is:author')


/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /category
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	Route.post( '',           'v1/CategoryController.store')
	Route.post( 'link/case',	'v1/CategoryController.linkCase')
  Route.put(  ':id',        'v1/CategoryController.update')

}).prefix('/api/v1/category').middleware('auth', 'is:author')

Route.group(() => {
  Route.get(  'list', 			'v1/CategoryController.listCategories')
  Route.get(  'cases', 			'v1/CategoryController.listCases')

}).prefix('/api/v1/category').middleware('auth')

/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /institution
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {

    Route.get( '',          'v1/InstitutionController.listInstitutions').middleware(['auth'])
}).prefix('/api/v1/institutions')


/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /group
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
	Route.post(   '',           'GroupController.store')
	Route.post(   'link/user',	'GroupController.linkUser')
  Route.delete( 'user',	      'GroupController.removeUser')
  Route.get(    'cases', 			'GroupController.listCases')
  Route.get(    'users', 			'GroupController.listUsers')
  Route.get(    '',       'GroupController.listGroups')

  // Route.get(  'list', 			'v1/CategoryController.listCategories')
  // Route.put(  ':id',        'v1/CategoryController.update')

}).prefix('/api/v1/group').middleware('auth')

/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /logger
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post( '', 			'v1/LoggerController.store')
  Route.get(  'list', 	'v1/LoggerController.listLogger')
}).prefix('/api/v1/logger').middleware('auth')

/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /event
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post( '', 			'v1/EventController.store')
}).prefix('/api/v1/event').middleware('auth')

/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /term
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post( '', 			   'v1/TermController.store').middleware('auth')
  Route.post( 'link/user', 'v1/TermController.linkUser')
  Route.get(  'user',      'v1/TermController.showTermUser')
  Route.get(  'users',     'v1/TermController.listTermUsers').middleware(['auth', 'is:admin'])
}).prefix('/api/v1/term')

/*
|----------------------------------------------------------------------------------------------
|       api: v1
|  resource: /admin
|----------------------------------------------------------------------------------------------
*/
Route.group(() => {

  Route.get(   'user/property',     					'v1/AdminController.listUserProperties')
  Route.post(  'user/property',     					'v1/AdminController.storeUserProperty')
  Route.put(   'user/property',     					'v1/AdminController.updateUserProperty')

	Route.get(   'users',          				'v1/UserController.index')

	Route.get(   'roles',               		'v1/AdminController.list_roles')
	Route.post(  'role',             			'v1/AdminController.create_role')
	Route.post(  'role/link/permission',		'v1/AdminController.link_role_permission')

	Route.get(   'user/:id/roles',		  		'v1/AdminController.list_roles_by_user')
	Route.post(  'user/link/role',				'v1/AdminController.linkRoleUser')

	Route.get(   'cases',     					'v1/CaseController.index')

	Route.get(   'quests',     					'v1/QuestController.index')
	Route.post(  'quest/link/user',				'v1/QuestController.linkUser')
	Route.delete('quest/:id',					'v1/QuestController.destroy')

	Route.post(  'institution',       			'v1/InstitutionController.store')

	Route.post(  'revoke_tokens',     			'v1/AdminController.revoke_tokens')

  Route.put(  'user/:id',        'v1/AdminController.updateUser')

  Route.get(   'groups',     					'v1/AdminController.listGroups')

}).prefix('/api/v1/admin').middleware(['auth', 'is:admin'])


/* Test route */
Route.get('/api/imagetest', 	'TestController.index')
Route.post('/', 							'TestController.create').as('profile');
