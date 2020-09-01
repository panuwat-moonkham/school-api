'use strict'

const Database = use('Database')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return { error: ` param: ${number} is not support, Pleasr use number type param instead.` }

    return {}
}

class SubjectController {
    async index(){
        const data = await Database.table('subjects')

        return { status : 200 , error : undefined, data : subjects}
    }

    async show({request}){
        const { id } = request.params

        const validatedValue = numberTypeParamValidator(id)

        if(validatedValue.error) return {status: 500, error : validatedValue.error, data : undefined}

        const subjects = await Database
        .select('*')
        .from('subjects')
        .where("subject_id",id)
        .first()

        return{ status: 200, error : undefined, data : subjects ||{} }
        //return teacher || {}
    }

    async store ({request}){
        const {title,teacher_id} = request.body

        const missingKeys=[]
        if(!title) missingKeys.push('title')

        if(missingKeys.length)
            return {status: 422, error:`${missingKeys} is missing.`, data:undefined}

        const subject = await Database
        .table('subjects')
        .insert({title,teacher_id})

        return {status : 200,error : undefined , data : {title,teacher_id} }
    }

    async showTeacher({request}){
        const {id} = request.params
    }

    async update({request}){
        const {body,params} = request
        const {id} = params
        const {title} = body

        const subjectId = await Database
        .table('subjects')
        .where({subject_id:id})
        .update({title})

        const subject = await Database
        .table('subjects')
        .where({subject_id: subjectId})
        .first()

        return {status: 200, error: undefined, data: subject }
    }

    async destroy({request}){
        const {id} = request.params

        await Database
        .table('subjects')
        .where({subject_id:id})
        .delete()

        return {status: 200, error: undefined, data: {massage: 'success' }}
    }
}

module.exports = SubjectController
