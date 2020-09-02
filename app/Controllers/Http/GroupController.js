'use strict'

const Database = use('Database')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return { error: ` param: ${number} is not support, Pleasr use number type param instead.` }

    return {}
}

class GroupController {
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

        return{ status: 200, error : undefined, data : subject ||{} }
    }

    async store ({request}){
        const {name} = request.body
        const group = await Subject.create({name})

        return {status : 200,error : undefined , data : group }
    }

    async showGroup({request}){
        const {id} = request.params
        const group = await Database
        .table('groups')
        .where({group_id: id})
        .innerJoin('students','groups.group_id','students.group_id')
        .first()

        return {status: 200, error: undefined, data: group||{}}
    }

    async update({request}){
        const {body,params} = request
        const {id} = params
        const {name} = body

        const groupId = await Database
        .table('groups')
        .where({group_id:id})
        .update({name})

        const group = await Database
        .table('groups')
        .where({subject_id: groupId})
        .first()

        return {status: 200, error: undefined, data: group }
    }

    async destroy({request}){
        const {id} = request.params

        await Database
        .table('groups')
        .where({group_id:id})
        .delete()

        return {status: 200, error: undefined, data: {massage: 'success' }}
    }
}

module.exports = GroupController
