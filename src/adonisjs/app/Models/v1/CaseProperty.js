'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CaseProperty extends Model {
  static get incrementing () {
    return false
  }
  static get table () {
    return 'case_properties'
  }
}

module.exports = CaseProperty
