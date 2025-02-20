import {z, object} from "zod"

const payloadTrxKategori = {
    body : z.object({
        kode_kategori : z.number({
            required_error : "kode_kategori harus diisi",
            invalid_type_error : "kode_kategori harus integer"
        }),
        kode_unit_pbj : z.string({
            required_error : "kode_unit_pbj harus diisi",
            invalid_type_error : "kode_unit_pbj harus string"
        }),
        keperluan : z.string({
            required_error : "keperluan harus diisi",
            invalid_type_error : "keperluan harus string"
        }),
        kode_jenis_pengadaan : z.number({
            required_error : "kode_jenis_pengadaan harus diisi",
            invalid_type_error : "kode_jenis_pengadaan harus integer"
        }),
        pelaku_usaha : z.array(z.object({
            kode_jenis_vendor : z.number({
                required_error : "kode_jenis_vendor Harus Diisi",
                invalid_type_error : "kode_jenis_vendor Harus Integer"
            })
        }))
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

export const payloadTrxKategoriSchema = z.object({
    ...payloadTrxKategori
})


//Reusable

export const parameterSchema = object({
    ...parameter
})

export const querySchema = object({
    ...query
})


export type PayloadTrxKategoriSchema = z.TypeOf<typeof payloadTrxKategoriSchema>

//reusable

export type ParameterSchema = z.TypeOf<typeof parameterSchema>

export type QuerySchema = z.TypeOf<typeof querySchema>
