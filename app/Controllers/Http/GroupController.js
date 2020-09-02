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
        
        const groups = Group.query()
        if(references){
            const extractedRefences = references.split(",")
            groups.with(extractedRefences)
        }

        return { status : 200 , error : undefined, data :await groups.fetch()}
        }

    async show({request}){
        const { id } = request.params
        const group = await Group.find(id)

        return{ status: 200, error : undefined, data : group ||{} }
    }

    async store ({request}){
        const {name} = request.body
        const group = await Group.create({name})

        return {status : 200,error : undefined , data : group }
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
        .where({group_id: groupId})
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
