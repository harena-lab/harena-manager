'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Style extends Model {
    htmlFiles(){
        return this.hasMany('App/Models/v1/HTMLFile')
    }
}

module.exports = Style
