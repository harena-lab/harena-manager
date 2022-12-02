'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CaseAnnotation extends Model {

  static get incrementing () {
    return false
  }

  static get updatedAtColumn () {
    return null // disables updated_at
  }

  static get table () {
    return 'case_annotations'
  }
}

module.exports = CaseAnnotation
