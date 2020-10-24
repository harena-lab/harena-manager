'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PermissionSchema extends Schema {
  up () {
    this.create('permissions', (table) => {
      table.uuid('id')
      table.primary('id')

      // system, edition,  institution, group, private, user
      table.string('entity')

      // unicamp_id, jacinto, minho_id, primeira_turma, residencia_medica_id
      table.string('subject')

      // read, comment, share, edit, delete
      table.tinyint('clearance')

      // cases, templates, quests,  artifacts
      table.string('table')

      // 'caseid111-111.sei-la', 'templates1323-xyz', 'quests_id',  'artifactsId'
      table.uuid('table_id')

      table.timestamps()
    })
  }

  down () {
    this.drop('permissions')
  }
}

module.exports = PermissionSchema
