import {object, z} from "zod"

const payloadGetPenyedia = {
    body : z.object({
        vendor : z.array(z.object({
            kode_vendor : z.number({
                required_error : "kode_vendor harus diisi",
                invalid_type_error : "kode_vendor harus integer"
            })
        }))
    })
}

//Reusable
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

const parameter = {
    params : z.object({
        id : z.string({
            required_error : "Id Harus Diisi",
            invalid_type_error : "Id Harus String"
        })
    })
} 


export const payloadGetPenyediaSchema = object({
    ...payloadGetPenyedia
})

//Reusable
export const querySchema = object({
    ...query
})

export const parameterSchema = object({
    ...parameter
})


export type PayloadGetPenyediaSchema = z.TypeOf<typeof payloadGetPenyediaSchema>

//Reusable
export type QuerySchema = z.TypeOf<typeof querySchema>
export type ParameterSchema = z.TypeOf<typeof parameterSchema>