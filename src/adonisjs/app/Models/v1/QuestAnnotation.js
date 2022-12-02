'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class QuestAnnotation extends Model {
  static get incrementing () {
    return false
  }

  static get createdAtColumn () {
    return null // disables created_at
  }

  static get updatedAtColumn () {
    return null // disables updated_at
  }

  static get table () {
    return 'quest_annotations'
  }
}

module.exports = QuestAnnotation
