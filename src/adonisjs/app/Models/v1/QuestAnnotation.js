'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class QuestAnnotation extends Model {
  static get incrementing () {
    return false
  }
  static get table () {
    return 'quest_annotations'
  }
}

module.exports = QuestAnnotations
