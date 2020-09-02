'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Enrollment extends Model {
    static get primaryKey(){
        return 'teacher_id'
    }

    static get createdAtColumn(){
        return null;
    }

    static get updatedAtColumn(){
        return null;
    }

    subject(){
        return this.belongsTo('App/Models/Subject')
    }

}

module.exports = Enrollment
