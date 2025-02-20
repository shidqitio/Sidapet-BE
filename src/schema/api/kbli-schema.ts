import {z, object} from "zod"

//Reusable
const parameter = {
    params : z.object({
        id : z.string({
            required_error : "Id Harus Diisi",
            invalid_type_error : "Id Harus String"
        })
    })
}

const query = {
    query : z.object({
        page : z.string({
            required_error : "Page Harus Diisi", 
            invalid_type_error : "Page Harus String"
        }), 
        limit : z.string({
            required_error : "Limit Harus Diisi", 
            invalid_type_error : "Limit Harus String"
        })
    })
}


//Reusable

export const parameterSchema = object({
    ...parameter
})

export const querySchema = object({
    ...query
})


//reusable

export type ParameterSchema = z.TypeOf<typeof parameterSchema>

export type QuerySchema = z.TypeOf<typeof querySchema>
