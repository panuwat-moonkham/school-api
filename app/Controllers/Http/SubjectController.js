'use strict'

const Database = use('Database')
const Subject = use('App/Models/Subject')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return { error: ` param: ${number} is not support, Pleasr use number type param instead.` }

    return {}
}

class SubjectController {
    async index({request}){
        const {references = undefined} = request.qs
        
        const subjects = Subject.query()
        if(references){
            const extractedRefences = references.split(",")
            subjects.with(extractedRefences)
        }

        return { status : 200 , error : undefined, data :await subjects.fetch()}
        }

    async show({request}){
        const { id } = request.params
        const subject = await Subject.find(id)
        
        // const subjects = await Database
        // .select('*')
        // .from('subjects')
        // .where("subject_id",id)
        // .first()

        return{ status: 200, error : undefined, data : subject ||{} }
        //return teacher || {}
    }

    async store ({request}){
        const {title,teacher_id} = request.body
        // const subject = new Subject();
        // subject.title = title;
        // subject.teacher_id = teacher_id;
        // await subject.save()

        // const subject = await Database
        // .table('subjects')
        // .insert({title,teacher_id})

        const subject = await Subject.create({title,teacher_id})

        return {status : 200,error : undefined , data : subject }
    }

    async showTeacher({request}){
        const {id} = request.params
        const subject = await Database
        .table('subjects')
        .where({subject_id: id})
        .innerJoin('teachers','subjects.teacher_id','teachers.teacher_id')
        .first()

        return {status: 200, error: undefined, data: subject || {}}
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
