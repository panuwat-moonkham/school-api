'use strict'

const Database = use('Database')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return { error: ` param: ${number} is not support, Pleasr use number type param instead.` }

    return {}
}

class EnrollmentController {
    async index(){
        const data = await Database.table('enrollments')

        return { status : 200 , error : undefined, data : enrollments}
    }

    async show({request}){
        const { id } = request.params

        const validatedValue = numberTypeParamValidator(id)

        if(validatedValue.error) return {status: 500, error : validatedValue.error, data : undefined}

        const enrollment = await Database
        .select('*')
        .from('enrollments')
        .where("enrollment_id",id)
        .first()

        return{ status: 200, error : undefined, data : enrollment ||{} }
    }

    async store ({request}){
        const {mark} = request.body

        const missingKeys=[]
        if(!mark) missingKeys.push('first_name')

        if(missingKeys.length)
            return {status: 422, error:`${missingKeys} is missing.`, data:undefined}

        const enrollment = await Database
        .table('enrollments')
        .insert({mark,student_id})

        return {status : 200,error : undefined , data : {mark} }
    }
}

module.exports = EnrollmentController
