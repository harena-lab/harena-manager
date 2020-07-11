'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

const Factory = use('Factory')

const User = use('App/Models/v1/User');
const Role = use('App/Models/v1/Role');
const Permission = use('App/Models/v1/Permission');


class CreateNewPermissionsSchema extends Schema {
  async up () {
      let user = await User.findBy('username', 'jacinto')
      
      const contributor = await Factory.model('Adonis/Acl/Role').make({ name: 'case contributor', slug:  'contributor', description: 'permissions of a contributor'})
      await contributor.save()
      const read = await Factory.model('Adonis/Acl/Permission').make({ name: 'read cases', slug:  'read', description: 'read cases'})
      await read.save()
      await contributor.permissions().attach([read.id])
      await user.roles().attach([contributor.id])

      const editor = await Factory.model('Adonis/Acl/Role').make({ name: 'case editor', slug:  'editor', description: 'permissions of a editor'})
      await editor.save()
      const edit = await Factory.model('Adonis/Acl/Permission').make({ name: 'edit cases', slug:  'edit', description: 'edit cases'})
      await edit.save()
      await editor.permissions().attach([edit.id])
  }

  async down () {
    let contributor = await Role.findBy('slug', 'contributor')
    await contributor.delete()

    let read = await Permission.findBy('slug', 'read')
    await read.delete()

    let editor = await Role.findBy('slug', 'editor')
    await editor.delete()

    let edit = await Permission.findBy('slug', 'edit')
    await edit.delete()

  }
}

module.exports = CreateNewPermissionsSchema
