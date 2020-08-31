'use strict'

const Database = use('Database')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
        return { error: ` param: ${number} is not support, Pleasr use number type param instead.` }

    return {}
}

class GroupController {
    async index(){
        const data = await Database.table('groups')

        return { status : 200 , error : undefined, data : groups}
    }

    async show({request}){
        const { id } = request.params

        const validatedValue = numberTypeParamValidator(id)

        if(validatedValue.error) return {status: 500, error : validatedValue.error, data : undefined}

        const group = await Database
        .select('*')
        .from('groups')
        .where("group_id",id)
        .first()

        return{ status: 200, error : undefined, data : group ||{} }
    }

    async store ({request}){
        const {name} = request.body

        const missingKeys=[]
        if(!name) missingKeys.push('name')

        if(missingKeys.length)
            return {status: 422, error:`${missingKeys} is missing.`, data:undefined}

        const group = await Database
        .table('groups')
        .insert({name})

        return {status : 200,error : undefined , data : {name} }
    }
}

module.exports = GroupController
