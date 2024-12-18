import {object, z} from "zod"

const payloadKategori = {
    body : z.object({
        nama_kategori : z.string({
            required_error : "Nama Kategori Tidak Boleh Kosong",
            invalid_type_error : "Nama Kategori Harus String"
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

export const payloadKategoriSchema = object({
    ...payloadKategori
})

//Reusable
export const parameterSchema = object({
    ...parameter
})

export type PayloadKategoriSchema = z.TypeOf<typeof payloadKategoriSchema>

//Reusable 
export type ParameterSchema = z.TypeOf<typeof parameterSchema>