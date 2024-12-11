import {z, object} from "zod"

const payloadItemTanyaTpl = {
    body : z.object({
        nama_item : z.string({
            required_error : "nama_item harus diisi",
            invalid_type_error : "nama_item harus string"
        }),
        keterangan : z.string({
            invalid_type_error : "keterangan harus string"
        }).optional(),
        tipe_input : z.string({
            required_error : "tipe_input Harus Diisi", 
            invalid_type_error : "tipe_input harus string"
        })
    })
}


//Reusable
const parameter = {
    params : z.object({
        id : z.string({
            required_error : "Id Harus Diisi",
            invalid_type_error : "Id Harus String"
        })
    })
}


export const payloadItemTanyaTplSchema = object({
    ...payloadItemTanyaTpl
})

export const payloadUpdateItemTanyaTplSchema = object({
    ...parameter,
    ...payloadItemTanyaTpl
})

//Reusable

export const parameterSchema = object({
    ...parameter
})


export type PayloadItemTanyaTplSchema = z.TypeOf<typeof payloadItemTanyaTplSchema>

export type PayloadUpdateItemTanyaTplSchema = z.TypeOf<typeof payloadUpdateItemTanyaTplSchema>

//Reusable

export type ParameterSchema = z.TypeOf<typeof parameterSchema>