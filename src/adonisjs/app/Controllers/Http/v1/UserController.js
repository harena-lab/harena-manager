'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const Helpers = use('Helpers')
const Hash = use('Hash')

const Case = use('App/Models/v1/Case')
const User = use('App/Models/v1/User')
const RoleUser = use('App/Models/v1/RoleUser')
const UsersGroup = use('App/Models/v1/UsersGroup')
const Institution = use('App/Models/v1/Institution')
const Artifact = use('App/Models/v1/Artifact')
const Quest = use('App/Models/v1/Quest')
const Property = use('App/Models/v1/Property')
const UserProperty = use('App/Models/v1/UserProperty')
const Role = use('Adonis/Acl/Role')
const Group = use('App/Models/Group')
const Event = use('App/Models/v1/Event')
const Room = use('App/Models/v1/Room')
const RoomUser = use('App/Models/v1/RoomUser')

const uuidv4 = require('uuid/v4')
const Env = use('Env')

class UserController {
  /**
  * Show a list of all users.
  * GET users
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async index ({ request, response, view, auth }) {
    try {
      const users = await User.all()
      return response.json(users)
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  /**
  * Display a single user.
  * GET users/:id
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  * @param {View} ctx.view
  */
  async show ({ params, request, response, view }) {
    try {
      const user = await User.find(params.id)

      if (user != null) { return response.json(user) } else return response.status(500).json('user not found')
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.message })
    }
  }

  /**
  * Create/save a new user.
  * POST users
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  */
  async store ({ request, auth, response }) {
    try {
      const user = new User()

      user.id = await uuidv4()
      user.username = request.input('username')
      user.email = request.input('email')
      user.password = request.input('password')
      user.login = request.input('login')
      user.grade = request.input('grade')

      const request_institution = request.input('institution')

      if (request_institution != null) {
        const institution = await Institution.findBy('acronym', request.input('institution'))
        await user.institution().associate(institution)
      } else {
        await user.save()
      }

      return response.json(user)
    } catch (e) {
      console.log(e)
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json(e.sqlMessage)
      }

      return response.status(e.status).json({ message: e.message })
    }
  }

  /**
  * Self create/save a new user.
  * POST users
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response
  */
  async storeSelf ({ request, auth, response }) {
    const trx = await Database.beginTransaction()
    try {
      let feedback = ''
      let error = {
        code: 500,
        type: 'missing field',
        message: null
      }

      const r = request.all()

      if (r.username == null)
        error.message = 'username is mandatory'
      else if (r.email == null)
        error.message = 'email is mandatory'
      else if (r.password == null)
        error.message = 'password is mandatory'

      console.log('==== request')
      console.log(r.username)

      let user

      if (error.message == null) {
        let eventRel = null
        const event_id = r.eventId
        if (event_id != null)
          eventRel = await Event.find(event_id)

        if (eventRel == null)
          error = {
            code: 500,
            type: 'unauthorized',
            message: 'not authorized self signin'
          }
        else {
          if (eventRel.active <= 0)
            error = {
              code: 500,
              type: 'unauthorized',
              message: 'expired authorization for self signin'
            }
          else {
            user = new User()

            user.id = await uuidv4()
            user.username = r.username
            user.email = r.email
            user.password = r.password
            user.login = r.login
            user.grade = r.grade

            const institution_id = r.institution
            if (institution_id != null) {
              const ins = await Institution.findBy('acronym', institution_id)
              if (ins != null)
                user.institution_id = ins.id
              else
                error = {
                  code: 500,
                  type: 'institution not found',
                  message: 'institution not found'
                }
            }

            if (error.message == null) {
              await user.save(trx)
              feedback += 'user ' + user.username + ' created; '
              console.log('=== user saved')
              console.log(user)
            }

            if (error.message == null &&
                r.property_ids != null && r.property_values != null) {
              console.log('=== linking properties')
              console.log(r.property_ids)
              console.log(r.property_values)
              const pids = r.property_ids.trim().split(/"?[ ]*,[ ]*"?/)
              if (pids[0][0] == '"') pids[0] = pids[0].substring(1)
              let last = pids.length-1
              if (pids[last][pids[last].length-1] == '"')
                pids[last] = pids[last].substring(0, pids[last].length-1)
              const pvalues = r.property_values.trim().split(/"?[ ]*,[ ]*"?/)
              if (pvalues[0][0] == '"') pvalues[0] = pvalues[0].substring(1)
              last = pvalues.length-1
              if (pvalues[last][pvalues[last].length-1] == '"')
                pvalues[last] = pvalues[last]
                  .substring(0, pvalues[last].length-1)
              console.log(pids)
              console.log(pvalues)
              for (const p in pids) {
                const property = await Property.findOrCreate(
                  {id: pids[p]},
                  {id: pids[p], title: pids[p]}, trx)
                const up = new UserProperty()
                up.user_id = user.id
                up.property_id = pids[p]
                up.value = pvalues[p]
                await up.save(trx)
                console.log('=== property assigned')
                feedback += '(' + up.property_id + ',' + up.value + ') ' +
                            'property related to the user; '
              }
            }

            if (error.message == null && eventRel.role_id != null) {
              console.log('=== linking role')
              console.log(eventRel.role_id)
              const role = new RoleUser()
              role.user_id = user.id
              let rl = null
              if (eventRel.role_id != null)
                rl = await Role.find(eventRel.role_id)
              if (rl != null) {
                role.role_id = rl.id
                await role.save(trx)
                console.log('=== role assigned')
                feedback += rl.slug + ' role given to the user; '
              } else
                error = {
                  code: 500,
                  type: 'role not found',
                  message: 'role not found'
                }
            }

            if (error.message == null && eventRel.group_id != null) {
              console.log('=== linking group')
              console.log(eventRel.group_id)
              const group = new UsersGroup()
              group.user_id = user.id
              const gr = await Group.find(eventRel.group_id)
              if (gr != null) {
                group.group_id = gr.id
                await group.save(trx)
                console.log('=== group assigned')
                feedback += gr.title + ' group assigned to the user; '
              } else
                error = {
                  code: 500,
                  type: 'group not found',
                  message: 'group not found'
                }
            }

            if (error.message == null && eventRel.room_id != null) {
              console.log('=== linking room')
              console.log(eventRel.room_id)
              const room = new RoomUser()
              room.user_id = user.id
              const rm = await Room.find(eventRel.room_id)
              if (rm != null) {
                room.room_id = rm.id
                room.role =
                  (eventRel.room_role != null) ? eventRel.room_role : 1
                await room.save(trx)
                console.log('=== room assigned')
                feedback += rm.title + ' room assigned to the user; '
              } else
                error = {
                  code: 500,
                  type: 'room not found',
                  message: 'room not found'
                }
            }
          }
        }
      }
      if (error.message == null) {
        trx.commit()
        return response.json(
          {
            id: user.id,
            feedback: feedback
          }
        )
      } else {
        trx.rollback()
        return response.status(error.code).json({error: error})
      }
    } catch (e) {
      trx.rollback()
      console.log(e)
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({
          error: {
            type: 'duplicated',
            message: e.sqlMessage
          }
        })
      }
      return response.status(e.status).json({
        error: {
          code: 500,
          type: 'error',
          message: e.message}
      })
    }
  }

  /**
  * Update user details.
  * PUT or PATCH users/:id
  *
  * @param {object} ctx
  * @param {Request} ctx.request
  * @param {Response} ctx.response

  */
  async update ({ params, request, response, auth }) {
    try {
      const user = await User.find(auth.user.id)

      const updatedUser = {
        username : request.input('username') || user.username,
        email : request.input('email') || user.email,
        login : request.input('login') || user.login,
        grade : request.input('grade') || user.grade
      }

      if (user != null) {
        await user.merge(updatedUser)
        await user.save()
        return response.json(user)
      } else{
        console.log('save user error');
        return response.status(500).json('user not found')
      }
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }

  async updatePassword ({ params, request, response, auth }) {
    try {
      // console.log('updating password....')
      const oldPassword = request.input('oldPassword')
      const newPassword = request.input('newPassword')
      // console.log('-======================',auth.user.id)
      const user = await User.find(auth.user.id)

      if (user != null && await Hash.verify(oldPassword, auth.user.password)  && newPassword != oldPassword) {
        user.password = newPassword
        await user.save()
        console.log('Password changed successfully.')
        return response.json('Password changed successfully.')
      } else if(!await Hash.verify(oldPassword, auth.user.password)){
        console.log('Old password incorrect.')
        return response.json('Old password incorrect.')
      }else if(newPassword === oldPassword){
        console.log('Passwords must be different.')
        return response.json('Passwords must be different.')
      }else {
        console.log('Update password error, try again.')
        return response.json('Update password error, try again.')

      }
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    } finally{
      console.log('finally ended password update');
    }
  }

  async resetPassword ({ params, request, response, auth }) {
    try {
      const userId = request.input('userId')
      const newPassword = request.input('newPassword')
      const user = await User.find(userId)

      if (user != null) {
        user.password = newPassword
        await user.save()
        console.log('Password changed successfully.')
        return response.json('Password changed successfully.')
      } else {
        console.log('Update password error, try again.')
        return response.json('Update password error, try again.')
      }
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    } finally{
      console.log('finally ended password update');
    }
  }

  /** Delete a user with id.
  * DELETE user/:id */
  async destroy ({ params, response, auth }) {
    try {
      const user = await User.find(params.id)

      if (user != null) {
        await user.delete()
      } else return response.json('user not found')

      return response.json(user)
    } catch (e) {
      return response.status(e.status).json({ message: e.message })
    }
  }


  // @BROKEN
  async list_quests ({ request, response, auth }) {
    try {
      const user = auth.user

      const quests = await Database
        .from('quests')
        .where('author_id', '=', user.id)

      return response.json(quests)
      // return response.json(await user.quests().fetch())
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  async listCases ({ request, response, auth }) {
    try {
      const user = await auth.user

      const clearance = parseInt(request.input('clearance')) || 10

      var publishedFilter = parseInt(request.input('published')) || 0

      const institutionFilter = request.input('fInstitution') || `%`
      const userTypeFilter = request.input('fUserType') || `%`
      const specialtyFilter = request.input('fSpecialty') || `%`
      const propertyFilter = request.input('fProperty') || null
      const propertyValueFilter = request.input('fPropertyValue') || '%'
      let searchStringFilter = request.input('fSearchStr') || `%`
      var itemOffset = 0
      const itemLimit = request.input('nItems') || 20

      if(searchStringFilter != '%')
        searchStringFilter = `%${searchStringFilter}%`

      if (request.input('page') && request.input('page') < 1)
        itemOffset = 0
      else
        itemOffset = request.input('page') -1 || 0

      let result = null
      var totalPages = null
      if(propertyFilter != null){

        let countCases = await Database
        .from('cases')
        .join('permissions', function() {
          this.on('permissions.table_id', 'cases.id')
          .andOn('permissions.entity', '=', Database.raw('?', ['institution']))
          .andOn('permissions.subject', '=', Database.raw('?', [user.institution_id]))

        })
        .join('case_properties', 'case_properties.case_id', 'cases.id')
        .join('properties', 'properties.id', 'case_properties.property_id')
        .join('users', 'cases.author_id','users.id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('properties.title', propertyFilter)
        .where('case_properties.value','like', propertyValueFilter)
        .where('cases.published', '>=', publishedFilter)
        .where('cases.institution_id', 'like', institutionFilter)
        .where('cases.author_grade', 'like', userTypeFilter)
        .where(function(){
          if (specialtyFilter != '%')
          this.where('cases.specialty', 'like', specialtyFilter)
        })
        .where(function(){
          this
          .where('cases.title', 'like', searchStringFilter)
          .orWhere('cases.description', 'like', searchStringFilter)
          .orWhere('cases.keywords', 'like', searchStringFilter)
        })

        .where(function(){
          this
          .where('cases.author_id', user.id)
          .orWhere(function () {
            this
            .where(function(){
              this
              .where('permissions.entity', 'institution')
              .where('permissions.subject', user.institution_id)
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .countDistinct('cases.id as cases')
        // console.log('============ count cases')
        // console.log(countCases[0]['cases'] )
        // console.log(itemLimit)
        // console.log(countCases[0]['cases'] / itemLimit)
        // console.log(Math.ceil(countCases[0]['cases'] / itemLimit))
        totalPages = Math.ceil(countCases[0]['cases'] / itemLimit)

        if(itemOffset >= totalPages)
          itemOffset = 0

        const selectPropertyTitle = ('case_properties.value AS ' + propertyFilter)
        result = await Database
        .select([ 'cases.id', 'cases.title','cases.description', 'cases.language', 'cases.domain',
        'cases.specialty', 'cases.keywords', 'cases.complexity', 'cases.original_date',
        'cases.author_grade', 'cases.published', 'cases.author_id', 'users.username',
        'institutions.title AS institution', 'institutions.acronym AS institution_acronym',
        'institutions.country AS institution_country', 'cases.created_at',
        Database.raw(`CASE WHEN case_properties.value = 0 AND properties.title = 'feedback'
        THEN 'Waiting for feedback' WHEN case_properties.value = 1 AND properties.title = 'feedback'
        THEN 'Feedback complete' ELSE case_properties.value END AS ?`,[propertyFilter])])
        .distinct('cases.id')
        .from('cases')
        .join('permissions', function() {
          this.on('permissions.table_id', 'cases.id')
          .andOn('permissions.entity', '=', Database.raw('?', ['institution']))
          .andOn('permissions.subject', '=', Database.raw('?', [user.institution_id]))

        })
        .join('case_properties', 'case_properties.case_id', 'cases.id')
        .join('properties', 'properties.id', 'case_properties.property_id')

        .join('users', 'cases.author_id','users.id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('properties.title', propertyFilter)
        .where('case_properties.value','like', propertyValueFilter)
        .where('cases.published', '>=', publishedFilter)
        .where('cases.institution_id', 'like', institutionFilter)
        .where('cases.author_grade', 'like', userTypeFilter)
        .where(function(){
          if (specialtyFilter != '%')
          this.where('cases.specialty', 'like', specialtyFilter)
        })
        .where(function(){
          this
          .where('cases.title', 'like', searchStringFilter)
          .orWhere('cases.description', 'like', searchStringFilter)
          .orWhere('cases.keywords', 'like', searchStringFilter)
        })

        .where(function(){
          this
          .where('cases.author_id', user.id)
          .orWhere(function () {
            this
            .where(function(){
              this
              .where('permissions.entity', 'institution')
              .where('permissions.subject', user.institution_id)
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .orderBy('cases.created_at', 'desc')
        .offset(itemOffset * itemLimit)
        .limit(itemLimit)


      }else{
        let countCases = await Database
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .leftJoin('users_groups', function() {
          this.on('permissions.subject', '=', 'users_groups.group_id')
          .andOn('users_groups.user_id', '=', Database.raw('?', [user.id]));
        })
        .join('users', 'cases.author_id','users.id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('cases.published', '>=', publishedFilter)
        .where('cases.institution_id', 'like', institutionFilter)
        .where('cases.author_grade', 'like', userTypeFilter)
        .where(function(){
          if (specialtyFilter != '%')
          this.where('cases.specialty', 'like', specialtyFilter)
        })
        .where(function(){
          this
          .where('cases.title', 'like', searchStringFilter)
          .orWhere('cases.description', 'like', searchStringFilter)
          .orWhere('cases.keywords', 'like', searchStringFilter)
        })

        .where(function(){
          this
          .where('cases.author_id', user.id)
          .orWhere(function () {
            this
            .where(function(){
              this
              .where(function(){
                this
                .where('permissions.entity', 'institution')
                .where('permissions.subject', user.institution_id)
              })
              .orWhere(function(){
                this
                .where('permissions.entity', 'user')
                .where('permissions.subject', user.id)
              })
              .orWhere(function() {
                this
                .where('permissions.entity', 'group')
                .where('users_groups.user_id', user.id)
              })
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .countDistinct('cases.id as cases')
        // console.log('================================================================ number of pages')
        // console.log(countCases[0]['cases'])
        // console.log(itemLimit)
        // console.log(countCases[0]['cases'] / itemLimit)
        // console.log(Math.ceil(countCases[0]['cases'] / itemLimit))
        totalPages = Math.ceil(countCases[0]['cases'] / itemLimit)

        if(itemOffset >= totalPages)
          itemOffset = 0

        result = await Database
        .select([ 'cases.id', 'cases.title','cases.description', 'cases.language', 'cases.domain',
        'cases.specialty', 'cases.keywords', 'cases.complexity','cases.category_id', 'cases.original_date',
        'cases.author_grade', 'cases.published', 'cases.author_id', 'users.username',
        'institutions.title AS institution', 'institutions.acronym AS institution_acronym',
        'institutions.country AS institution_country', 'cases.created_at'])
        .distinct('cases.id')
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .leftJoin('users_groups', function() {
          this.on('permissions.subject', '=', 'users_groups.group_id')
          .andOn('users_groups.user_id', '=', Database.raw('?', [user.id]));
        })
        .join('users', 'cases.author_id','users.id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('cases.published', '>=', publishedFilter)
        .where('cases.institution_id', 'like', institutionFilter)
        .where('cases.author_grade', 'like', userTypeFilter)
        .where(function(){
          if (specialtyFilter != '%')
          this.where('cases.specialty', 'like', specialtyFilter)
        })
        .where(function(){
          this
          .where('cases.title', 'like', searchStringFilter)
          .orWhere('cases.description', 'like', searchStringFilter)
          .orWhere('cases.keywords', 'like', searchStringFilter)
        })

        .where(function(){
          this
          .where('cases.author_id', user.id)
          .orWhere(function () {
            this
            .where(function(){
              this
              .where(function(){
                this
                .where('permissions.entity', 'institution')
                .where('permissions.subject', user.institution_id)
              })
              .orWhere(function(){
                this
                .where('permissions.entity', 'user')
                .where('permissions.subject', user.id)
              })
              .orWhere(function() {
                this
                .where('permissions.entity', 'group')
                .where('users_groups.user_id', user.id)
              })
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .orderBy('cases.created_at', 'desc')
        .offset(itemOffset * itemLimit)
        .limit(itemLimit)

      }


      console.log(result)
      return response.json({cases:result, pages:totalPages})
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  // @ VERY SLOW requests - (because of full joining 'permission' table)
  async fullListCases ({ request, response, auth }) {
    try {
      const user = await auth.user

      const clearance = parseInt(request.input('clearance')) || 10

      var publishedFilter = parseInt(request.input('published')) || 0

      const institutionFilter = request.input('fInstitution') || `%`
      const userTypeFilter = request.input('fUserType') || `%`
      const specialtyFilter = request.input('fSpecialty') || `%`
      const propertyFilter = request.input('fProperty') || null
      const propertyValueFilter = request.input('fPropertyValue') || '%'
      let searchStringFilter = request.input('fSearchStr') || `%`
      var itemOffset = 0
      const itemLimit = request.input('nItems') || 20

      if(searchStringFilter != '%')
        searchStringFilter = `%${searchStringFilter}%`

      if (request.input('page') && request.input('page') < 1)
        itemOffset = 0
      else
        itemOffset = request.input('page') -1 || 0

      let result = null
      var totalPages = null
      if(propertyFilter != null){

        let countCases = await Database
        .from('cases')
        .join('case_properties', 'case_properties.case_id', 'cases.id')
        .join('properties', 'properties.id', 'case_properties.property_id')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .leftJoin('users_groups', function() {
          this.on('permissions.subject', '=', 'users_groups.group_id')
          .andOn('users_groups.user_id', '=', Database.raw('?', [user.id]));
        })
        .join('users', 'cases.author_id','users.id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('properties.title', propertyFilter)
        .where('case_properties.value','like', propertyValueFilter)
        .where('cases.published', '>=', publishedFilter)
        .where('cases.institution_id', 'like', institutionFilter)
        .where('cases.author_grade', 'like', userTypeFilter)
        .where(function(){
          if (specialtyFilter != '%')
          this.where('cases.specialty', 'like', specialtyFilter)
        })
        .where(function(){
          this
          .where('cases.title', 'like', searchStringFilter)
          .orWhere('cases.description', 'like', searchStringFilter)
          .orWhere('cases.keywords', 'like', searchStringFilter)
        })

        .where(function(){
          this
          .where('cases.author_id', user.id)
          .orWhere(function () {
            this
            .where(function(){
              this
              .where(function(){
                this
                .where('permissions.entity', 'institution')
                .where('permissions.subject', user.institution_id)
              })
              .orWhere(function(){
                this
                .where('permissions.entity', 'user')
                .where('permissions.subject', user.id)
              })
              .orWhere(function() {
                this
                .where('permissions.entity', 'group')
                .where('users_groups.user_id', user.id)
              })
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .countDistinct('cases.id as cases')
        // console.log('============ count cases')
        // console.log(countCases[0]['cases'] )
        // console.log(itemLimit)
        // console.log(countCases[0]['cases'] / itemLimit)
        // console.log(Math.ceil(countCases[0]['cases'] / itemLimit))
        totalPages = Math.ceil(countCases[0]['cases'] / itemLimit)

        if(itemOffset >= totalPages)
          itemOffset = 0

        const selectPropertyTitle = ('case_properties.value AS ' + propertyFilter)
        result = await Database
        .select([ 'cases.id', 'cases.title','cases.description', 'cases.language', 'cases.domain',
        'cases.specialty', 'cases.keywords', 'cases.complexity', 'cases.original_date',
        'cases.author_grade', 'cases.published', 'cases.author_id', 'users.username',
        'institutions.title AS institution', 'institutions.acronym AS institution_acronym',
        'institutions.country AS institution_country', 'cases.created_at',
        Database.raw(`CASE WHEN case_properties.value = 0 AND properties.title = 'feedback'
        THEN 'Waiting for feedback' WHEN case_properties.value = 1 AND properties.title = 'feedback'
        THEN 'Feedback complete' ELSE case_properties.value END AS ?`,[propertyFilter])])
        .distinct('cases.id')
        .from('cases')
        .join('case_properties', 'case_properties.case_id', 'cases.id')
        .join('properties', 'properties.id', 'case_properties.property_id')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .leftJoin('users_groups', function() {
          this.on('permissions.subject', '=', 'users_groups.group_id')
          .andOn('users_groups.user_id', '=', Database.raw('?', [user.id]));
        })
        .join('users', 'cases.author_id','users.id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('properties.title', propertyFilter)
        .where('case_properties.value','like', propertyValueFilter)
        .where('cases.published', '>=', publishedFilter)
        .where('cases.institution_id', 'like', institutionFilter)
        .where('cases.author_grade', 'like', userTypeFilter)
        .where(function(){
          if (specialtyFilter != '%')
          this.where('cases.specialty', 'like', specialtyFilter)
        })
        .where(function(){
          this
          .where('cases.title', 'like', searchStringFilter)
          .orWhere('cases.description', 'like', searchStringFilter)
          .orWhere('cases.keywords', 'like', searchStringFilter)
        })

        .where(function(){
          this
          .where('cases.author_id', user.id)
          .orWhere(function () {
            this
            .where(function(){
              this
              .where(function(){
                this
                .where('permissions.entity', 'institution')
                .where('permissions.subject', user.institution_id)
              })
              .orWhere(function(){
                this
                .where('permissions.entity', 'user')
                .where('permissions.subject', user.id)
              })
              .orWhere(function() {
                this
                .where('permissions.entity', 'group')
                .where('users_groups.user_id', user.id)
              })
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .orderBy('cases.created_at', 'desc')
        .offset(itemOffset * itemLimit)
        .limit(itemLimit)


      }else{
        let countCases = await Database
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .leftJoin('users_groups', function() {
          this.on('permissions.subject', '=', 'users_groups.group_id')
          .andOn('users_groups.user_id', '=', Database.raw('?', [user.id]));
        })
        .join('users', 'cases.author_id','users.id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('cases.published', '>=', publishedFilter)
        .where('cases.institution_id', 'like', institutionFilter)
        .where('cases.author_grade', 'like', userTypeFilter)
        .where(function(){
          if (specialtyFilter != '%')
          this.where('cases.specialty', 'like', specialtyFilter)
        })
        .where(function(){
          this
          .where('cases.title', 'like', searchStringFilter)
          .orWhere('cases.description', 'like', searchStringFilter)
          .orWhere('cases.keywords', 'like', searchStringFilter)
        })

        .where(function(){
          this
          .where('cases.author_id', user.id)
          .orWhere(function () {
            this
            .where(function(){
              this
              .where(function(){
                this
                .where('permissions.entity', 'institution')
                .where('permissions.subject', user.institution_id)
              })
              .orWhere(function(){
                this
                .where('permissions.entity', 'user')
                .where('permissions.subject', user.id)
              })
              .orWhere(function() {
                this
                .where('permissions.entity', 'group')
                .where('users_groups.user_id', user.id)
              })
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .countDistinct('cases.id as cases')
        // console.log('================================================================ number of pages')
        // console.log(countCases[0]['cases'])
        // console.log(itemLimit)
        // console.log(countCases[0]['cases'] / itemLimit)
        // console.log(Math.ceil(countCases[0]['cases'] / itemLimit))
        totalPages = Math.ceil(countCases[0]['cases'] / itemLimit)

        if(itemOffset >= totalPages)
          itemOffset = 0

        result = await Database
        .select([ 'cases.id', 'cases.title','cases.description', 'cases.language', 'cases.domain',
        'cases.specialty', 'cases.keywords', 'cases.complexity', 'cases.original_date',
        'cases.author_grade', 'cases.published', 'cases.author_id', 'users.username',
        'institutions.title AS institution', 'institutions.acronym AS institution_acronym',
        'institutions.country AS institution_country', 'cases.created_at'])
        .distinct('cases.id')
        .from('cases')
        .leftJoin('permissions', 'cases.id', 'permissions.table_id')
        .leftJoin('users_groups', function() {
          this.on('permissions.subject', '=', 'users_groups.group_id')
          .andOn('users_groups.user_id', '=', Database.raw('?', [user.id]));
        })
        .join('users', 'cases.author_id','users.id')
        .join('institutions', 'users.institution_id', 'institutions.id')
        .where('cases.published', '>=', publishedFilter)
        .where('cases.institution_id', 'like', institutionFilter)
        .where('cases.author_grade', 'like', userTypeFilter)
        .where(function(){
          if (specialtyFilter != '%')
          this.where('cases.specialty', 'like', specialtyFilter)
        })
        .where(function(){
          this
          .where('cases.title', 'like', searchStringFilter)
          .orWhere('cases.description', 'like', searchStringFilter)
          .orWhere('cases.keywords', 'like', searchStringFilter)
        })

        .where(function(){
          this
          .where('cases.author_id', user.id)
          .orWhere(function () {
            this
            .where(function(){
              this
              .where(function(){
                this
                .where('permissions.entity', 'institution')
                .where('permissions.subject', user.institution_id)
              })
              .orWhere(function(){
                this
                .where('permissions.entity', 'user')
                .where('permissions.subject', user.id)
              })
              .orWhere(function() {
                this
                .where('permissions.entity', 'group')
                .where('users_groups.user_id', user.id)
              })
            })
            .where('permissions.clearance', '>=', clearance)
            .where(function(){
              this
              .whereNull('permissions.subject_grade')
              .orWhere('permissions.subject_grade', user.grade)
            })
          })
        })
        .orderBy('cases.created_at', 'desc')
        .offset(itemOffset * itemLimit)
        .limit(itemLimit)

      }


      console.log(result)
      return response.json({cases:result, pages:totalPages})
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  // @broken
  async list_cases_by_quests ({ params, response, auth }) {
    try {
      const user = await auth.user

      Database
      .select('*')
      .from('quests_users')
      .where('user_id', user.id)
      .leftJoin('cases', 'quests.case_id', 'cases.id')

      const quests = await user.quests().fetch()

      const cases = await user.cases().fetch()
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  async listContributingQuests ({ response, auth }) {
    try {
      const user = await auth.user

      const resultQuest = await Database
        .select('*')
        .from('quests')
        .where('author_id', user.id)

      /*
      const resultQuest = await Database
        .select('*')
        .from('quests_users')
        .where('user_id', user.id)
        .whereIn('permission', ['write', 'share', 'delete'])
        .leftJoin('quests', 'quests_users.quest_id', 'quests.id')
      */

      const base_url = Env.getOrFail('APP_URL')
      const quests = []

      for (var i = 0; i < resultQuest.length; i++) {
        const questJSON = {}

        questJSON.id = resultQuest[i].id
        questJSON.title = resultQuest[i].title
        questJSON.color = resultQuest[i].color

        const artifact = await Artifact.find(resultQuest[i].artifact_id)
        questJSON.url = base_url + artifact.relative_path

        quests.push(questJSON)
      }

      return response.json(quests)
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  async listPlayingQuests ({ response, auth }) {
    try {
      const user = await auth.user

      const resultQuest = await Database
      .select('*')
      .from('quests_users')
      .where('user_id', user.id)
      .where('permission', 'read')
      .leftJoin('quests', 'quests_users.quest_id', 'quests.id')

      const base_url = Env.getOrFail('APP_URL')
      const quests = []

      for (var i = 0; i < resultQuest.length; i++) {
        const questJSON = {}

        questJSON.id = resultQuest[i].quest_id
        questJSON.title = resultQuest[i].title
        questJSON.color = resultQuest[i].color

        const artifact = await Artifact.find(resultQuest[i].artifact_id)
        questJSON.url = base_url + artifact.relative_path

        // let properties = await artifact.properties().fetch()

        // let resultProperties = await Database
        //   .select('*')
        //   .from('artifacts_properties')
        //   .where('artifact_id', artifact.id)
        //   .leftJoin('properties', 'artifacts_properties.property_id', 'properties.id')

        // let propertiesJSON = []
        // console.log(artifact.id)
        // console.log(resultProperties)
        // for (var i = 0; i < resultProperties.length; i++) {
        //   console.log('aqui')
        //   let propertyJSON = {}
        //   propertyJSON.title = resultProperties[i].title
        //   propertyJSON.value = resultProperties[i].value
        //   propertiesJSON.push(propertyJSON)
        // }

        // questJSON.properties = propertiesJSON

        quests.push(questJSON)
      }

      return response.json(quests)
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  // User properties

  async listProperties ({request, response, auth}){
    try {
      const user = await User.find(auth.user.id)
      const propertyTitle = request.input('propertyTitle') || '%'
      const result = await Database
      .select(['properties.title','user_properties.value'])
      .from('user_properties')
      .join('properties', 'properties.id', 'user_properties.property_id')
      .where('user_properties.user_id', user.id)
      .where('properties.title', 'like', propertyTitle)

      return response.json({userProperty: result})
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }

  }

  async storeProperty ({request, response, auth}){
    const trx = await Database.beginTransaction()
    try {
      const user = await User.find(auth.user.id)
      const propertyTitle = request.input('propertyTitle')
      const propertyValue = request.input('propertyValue')
      const property = await Property.findOrCreate(
        { title: propertyTitle },
        { id: await uuidv4(), title: propertyTitle }, trx
      )
      const userProperty = await UserProperty.findOrCreate(
        { user_id: user.id, property_id: property.id},
        { user_id: user.id, property_id: property.id, value: propertyValue}, trx
      )

      await property.save(trx)
      await userProperty.save(trx)
      trx.commit()

      return response.json({property: property, userProperty: userProperty})
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(500).json({ message: e.message })
    }

  }

  async updateProperty ({request, response, auth}){
      const trx = await Database.beginTransaction()
      try {
        const user = await User.find(auth.user.id)
        const propertyTitle = request.input('propertyTitle')
        const propertyValue = request.input('propertyValue')

        const property = await Property.findBy('title', propertyTitle)

        var userProperty = await UserProperty
          .query()
          .where('property_id', property.id)
          .where('user_id', user.id)
          .fetch()
        userProperty = userProperty.last()

        await trx
        .table('user_properties')
        .where('property_id', property.id)
        .where('user_id', user.id)
        .update({ value: propertyValue})

        userProperty.value = propertyValue
        trx.commit()

        return response.json({userProperty: userProperty})
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }
}

module.exports = UserController
