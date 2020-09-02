'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')

const Role = use('Adonis/Acl/Role');
const Permission = use('Adonis/Acl/Permission');
const User = use('App/Models/v1/User');

const uuidv4 = require('uuid/v4');

class AdminController {

    async create_role({ request, response }) {
        try {

            let role = new Role()
            role.id = await uuidv4()

            let r = request.all()
            role.merge(r)

            await role.save()

            return response.json(role)
        } catch(e){
            console.log(e)

            if (e.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({ code: e.code, message: e.sqlMessage })
            }
            return response.status(500).json({ message: e.toString() })
        }
    }


    async linkRoleUser({ request, response }) {
        try {
            const {userId, roleId} = request.post()
            let user = await User.find(userId)
            let role = await Role.find(roleId)

            await user.roles().attach(role.id)
            return response.json(role.slug + ' role has given to the user ' + user.username)
        } catch (e) {
            console.log(e)
            return response.status(500).json(e)
        }
    }

    async link_role_permission({ request, response }) {
        try {
            const {permission_id, role_id} = request.post()
            let permission = await User.find(permission_id)
            let role = await Role.find(role_id)

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

    async list_roles({ response }) {
        try{
            let roles = await Role.all()
            return response.json(roles)
        } catch(e){
            return response.status(500).json({ message: e.toString() })
        }
    }



    async list_roles_by_user({ params, response }) {
        try{
            let user = await User.find(params.id)

            return response.json(await user.roles().fetch())
        } catch(e){
            console.log(e)
            return response.status(500).json({ message: e.toString() })
        }
    }



    async revoke_tokens({ auth, params, response }) {
        try{
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
        } catch(e){
            console.log(e)
            return response.status(500).json({ message: e.message })
        }
    }
}

module.exports = AdminController
