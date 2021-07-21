'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const Role = use('Adonis/Acl/Role')
const Permission = use('Adonis/Acl/Permission')
const User = use('App/Models/v1/User')
const Group = use('App/Models/Group')
const Property = use('App/Models/v1/Property')
const UserProperty = use('App/Models/v1/UserProperty')


const uuidv4 = require('uuid/v4')

class AdminController {
  async create_role ({ request, response }) {
    try {
      const role = new Role()
      role.id = await uuidv4()

      const r = request.all()
      role.merge(r)

      await role.save()

      return response.json(role)
    } catch (e) {
      console.log(e)

      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ code: e.code, message: e.sqlMessage })
      }
      return response.status(500).json({ message: e.toString() })
    }
  }

  async updateUser ({ params, request, response, auth }) {
    try {
      console.log('============')
      const user = await User.find(params.id)

      const newUser = {
          username : request.input('username') || user.username,
          email : request.input('email') || user.email,
          login : request.input('login') || user.login,
          grade : request.input('grade') || user.grade,
          password : request.input('password') || user.password,
          institution_id: request.input('institution_id') || user.institution_id,
          course_id:  request.input('course_id') || user.course_id
      }


      if (user != null) {
        await user.merge(newUser)
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

  async linkRoleUser ({ request, response }) {
    try {
      const { userId, roleId } = request.post()
      const user = await User.find(userId)
      const role = await Role.find(roleId)

      await user.roles().attach(role.id)
      return response.json(role.slug + ' role has given to the user ' + user.username)
    } catch (e) {
      console.log(e)
      return response.status(500).json(e)
    }
  }

  async link_role_permission ({ request, response }) {
    try {
      const { permission_id, role_id } = request.post()
      const permission = await User.find(permission_id)
      const role = await Role.find(role_id)

      await role.permissions().attach(permission.id)

      role.permissions = await role.permissions().fetch()

      return response.json(role)
    } catch (e) {
      console.log(e)
      if (e.code === 'ER_DUP_ENTRY') {
        return response.status(409).json({ message: e.message })
      }

      return response.status(500).json({ message: e.toString() })
    }
  }

  async list_roles ({ response }) {
    try {
      const roles = await Role.all()
      return response.json(roles)
    } catch (e) {
      return response.status(500).json({ message: e.toString() })
    }
  }

  async list_roles_by_user ({ params, response }) {
    try {
      const user = await User.find(params.id)

      return response.json(await user.roles().fetch())
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.toString() })
    }
  }

  async revoke_tokens ({ auth, params, response }) {
    try {
      // await user.tokens().update({ is_revoked: true })
      // console.log('antes')
      // console.log(await auth.listTokens())
      // //         const affectedRows = await Database
      // //             .table('tokens').update('is_revoked', true)
      // // console.log(affectedRows)
      // console.log('depois')
      // console.log(await auth.listTokens())
      await auth.revokeTokens()
      return response.json('tokens revoked')
    } catch (e) {
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }

  async listGroups ({request, auth, response}){

    try {
      const result = await Group.all()

      return response.json(result)
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }

  async listUserProperties ({request, response}){

    try {
      const user = await User.find(request.input('userId'))
      const propertyTitle = request.input('propertyTitle') || '%'
      if(user){
        const result = await Database
        .select(['properties.title','user_properties.value'])
        .from('user_properties')
        .join('properties', 'properties.id', 'user_properties.property_id')
        .where('user_properties.user_id', user.id)
        .where('properties.title', 'like', propertyTitle)

        return response.json({userProperty: result, userId: user.id})
      }
    } catch (e) {
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }

  async storeUserProperty ({request, response}){

    const trx = await Database.beginTransaction()
    try {
      const user = await User.find(request.input('userId'))
      const propertyTitle = request.input('propertyTitle')
      const propertyValue = request.input('propertyValue')
      if(user && propertyTitle && propertyValue){
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

        return response.json({property: property, userProperty: userProperty, userId: user.id})
      }else if(!user){
        trx.rollback()
        return response.status(500).json({ message: ('Error, could not find an user with this id: '+user.id) })
      }else if(!propertyTitle){
        trx.rollback()
        return response.status(500).json({ message: 'Error, property title missing' })
      }else if(!propertyValue){
        trx.rollback()
        return response.status(500).json({ message: 'Error, property value missing' })
      }
    } catch (e) {
      trx.rollback()
      console.log(e)
      return response.status(e.status).json({ message: e.toString() })
    }
  }

  async updateUserProperty ({request, response}){
    const trx = await Database.beginTransaction()
    try {
      const user = await User.find(request.input('userId'))
      const propertyTitle = request.input('propertyTitle')
      const propertyValue = request.input('propertyValue')

      const property = await Property.findBy('title', propertyTitle)
      if(user && propertyTitle && propertyValue && property){
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
      }else if(!user){
        trx.rollback()
        return response.status(500).json({ message: ('Error, could not find an user with this id: '+user.id) })
      }else if(!property){
        return response.status(500).json({ message: ('Error, could not find an property with this title: '+propertyTitle) })
      }else if(!propertyTitle){
        trx.rollback()
        return response.status(500).json({ message: 'Error, property title missing' })
      }else if(!propertyValue){
        trx.rollback()
        return response.status(500).json({ message: 'Error, property value missing' })
      }
    } catch (e) {
      trx.rollback()
      console.log('============ update admin user property error')
      console.log(e)
      return response.status(500).json({ message: e.message })
    }
  }


}

module.exports = AdminController
