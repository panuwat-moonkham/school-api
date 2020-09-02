'use strict'

const Database = use('Database')
const Validator = use('Validator')
const Enrollment = use('App/Models/Enrollment')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return { error: ` param: ${number} is not support, Pleasr use number type param instead.` }

    return {}
}

class EnrollmentController {
    async index(){
        const {references = undefined} = request.qs
        
        const enrollments = Enrollment.query()
        if(references){
            const extractedRefences = references.split(",")
            enrollments.with(extractedRefences)
        }

        return { status : 200 , error : undefined, data :await enrollments.fetch()}
    }

    async show({request}){
        const { id } = request.params
        const enrollment = await Enrollment.find(id)

        return{ status: 200, error : undefined, data : enrollment ||{} }
    }
    async showEnrollment({request}){
        const {id} = request.params
        const enrollment = await Database
        .table('enrollments')
        .where({enrollment_id: id})
        .innerJoin('students','enrollments.student_id','students.student_id')
        .first()

        return {status: 200, error: undefined, data: enrollment||{}}
    }

    async store ({request}){
        const {mark,student_id,subject_id} = request.body
        const rules ={
            mark:'required'
        }
        const validation = await Validator.validateAll(request.body,rules)
        if(validation.fails())
            return {status: 422, error: validation.messages(), data: undefined}
        
        const enrollment = await Enrollment.create({mark,student_id,subject_id})

        return {status : 200,error : undefined , data : enrollment }
    }

    async update({request}){
        const {body,params} = request
        const {id} = params
        const {mark,student_id,subject_id} = body

        const enrollmentId = await Database
        .table('enrollments')
        .where({student_id:id})
        .update({mark,student_id,subject_id})

        const enrollment = await Database
        .table('enrollments')
        .where({enrollment_id: enrollmentId})
        .first()

        return {status: 200, error: undefined, data: enrollment }
    }

    async destroy({request}){
        const {id} = request.params

        await Database
        .table('enrollments')
        .where({enrollment_id:id})
        .delete()

        return {status: 200, error: undefined, data: {massage: 'success' }}
    }
}

module.exports = EnrollmentController
