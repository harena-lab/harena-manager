'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const uuidv4 = require('uuid/v4');

class Quest extends Model {
    static get primaryKey () {
        return 'uuid'
    }

    static get incrementing () {
        return false
    }
}

module.exports = Quest
