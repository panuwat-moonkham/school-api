'use strict'

const Database = use('Database')
const Hash = use('Hash')
const Validator = use('Validator')
const Student = use('App/Models/Student')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return { error: ` param: ${number} is not support, Pleasr use number type param instead.` }

    return {}
}

class StudentController {
    async index(){
        const {references = undefined} = request.qs
        
        const students = Student.query()
        if(references){
            const extractedRefences = references.split(",")
            students.with(extractedRefences)
        }

        return { status : 200 , error : undefined, data :await students.fetch()}
    }

    async show({request}){
        const { id } = request.params
        const student = await Student.find(id)

        return{ status: 200, error : undefined, data : student ||{} }
    }
    async showStudent({request}){
        const {id} = request.params
        const student = await Database
        .table('students')
        .where({student_id: id})
        .innerJoin('groups','students.group_id','groups.group_id')
        .first()

        return {status: 200, error: undefined, data: student||{}}
    }

    async store ({request}){
        const {first_name,last_name,email,hashedPassword,group_id} = request.body
        const rules ={
            first_name:'required',
            last_name:'required',
            email:'required|email|unique:students,email',
            password:'requiredmin:8'
        }
        const validation = await Validator.validateAll(request.body,rules)
        if(validation.fails())
            return {status: 422, error: validation.messages(), data: undefined}
        
        const hashedPassword = await Hash.make(password)
        const student = await Student.create({first_name,last_name,email,password:hashedPassword,group_id})

        return {status : 200,error : undefined , data : student }
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
