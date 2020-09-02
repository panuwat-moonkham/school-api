'use strict'

const Database = use('Database')
const Hash = use('Hash')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return { error: ` param: ${number} is not support, Pleasr use number type param instead.` }

    return {}
}

class StudentController {
    async index(){
        const students = await Database.table('students')

        return { status : 200 , error : undefined, data : students}
    }

    async show({request}){
        const { id } = request.params

        const validatedValue = numberTypeParamValidator(id)

        if(validatedValue.error) return {status: 500, error : validatedValue.error, data : undefined}

        const student = await Database
        .select('*')
        .from('students')
        .where("student_id",id)
        .first()

        return{ status: 200, error : undefined, data : student ||{} }
    }

    async store ({request}){
        const {first_name,last_name,email,password,group_id} = request.body

        const missingKeys=[]
        if(!first_name) missingKeys.push('first_name')
        if(!last_name) missingKeys.push('last_name')
        if(!email) missingKeys.push('email')
        if(!password) missingKeys.push('password')

        if(missingKeys.length)
            return {status: 422, error:`${missingKeys} is missing.`, data:undefined}
        

        const hashedPassword = await Hash.make(password)

        const student = await Database
        .table('students')
        .insert({first_name,last_name,email,password:hashedPassword,group_id})

        return {status : 200,error : undefined , data : {first_name,last_name,email,password,group_id} }
    }

    async update({request}){
        const {body,params} = request
        const {id} = params
        const {first_name,last_name,email,group_id} = body

        const studentId = await Database
        .table('students')
        .where({student_id:id})
        .update({first_name,last_name,email,group_id})

        const student = await Database
        .table('students')
        .where({student_id: studentId})
        .first()

        return {status: 200, error: undefined, data: student }
    }

    async destroy({request}){
        const {id} = request.params

        await Database
        .table('students')
        .where({student_id:id})
        .delete()

        return {status: 200, error: undefined, data: {massage: 'success' }}
    }
}

module.exports = StudentController
