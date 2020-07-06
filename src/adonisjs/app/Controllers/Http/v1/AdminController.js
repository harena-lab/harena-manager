'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Role = use('Adonis/Acl/Role');
const Permission = use('Adonis/Acl/Permission');
const User = use('App/Models/v1/User');

class AdminController {
    async create_role({ request, response }) {
        try {
            let r = request.all()

            let role = new Role()
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

    async create_permission({ request, response }) {
        try {
            let input = request.all()

            let permission = new Permission()
            permission.merge(input)

            await permission.save()

            return response.json(permission)
        } catch(e){
            console.log(e)

            if (e.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({ code: e.code, message: e.sqlMessage })
            }
            return response.status(500).json({ message: e.toString() })
        }
    }

    async link_role_user({ request, response }) {
        try {
            const {user_id, role_id} = request.post()
            let user = await User.find(user_id)
            let role = await Role.find(role_id)

            await user.roles().attach(role.id)

            // user.quests = await user.quests().fetch()

            return response.json(user)
        } catch (e) {
            console.log(e)
            if (e.code === 'ER_DUP_ENTRY') {
                return response.status(409).json({ message: e.message })
            }

            return response.status(500).json({ message: e.toString() })
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

    async list_permissions({ response }) {
        try{
            let permissions = await Permission.all()
            return response.json(permissions)
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

    async list_permissions_by_role({ params, response }) {
        try{
            let role = await Role.find(params.id)

            return response.json(await role.permissions().fetch())
        } catch(e){
            console.log(e)
            return response.status(500).json({ message: e.message })
        }
    }

    async list_permissions_by_user({ params, response }) {
        try{

            let user = await User.find(params.id)
            
            // let role = await Role.find(params.id)

            return response.json(await user.getPermissions())
        } catch(e){
            console.log(e)
            return response.status(500).json({ message: e.message })
        }
    }
}

module.exports = AdminController
