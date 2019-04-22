'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Style extends Model {
    htmlFiles(){
        return this.hasMany('App/Models/v1/HtmlFile')
    }

    cssFiles(){
        return this.hasMany('App/Models/v1/CssFile')
    }

    images(){
        return this.hasMany('App/Models/v1/Image')
    }

    javascripts(){
        return this.hasMany('App/Models/v1/javaScript')
    }
}

module.exports = Style
