import {z, object} from "zod"

const payloadTrxKategori = {
    body : z.object({
        kode_kategori : z.number({
            required_error : "kode_kategori harus diisi",
            invalid_type_error : "kode_kategori harus integer"
        }),
        keperluan : z.string({
            required_error : "keperluan harus diisi",
            invalid_type_error : "keperluan harus string"
        }),
        kode_jenis_pengadaan : z.number({
            required_error : "kode_jenis_pengadaan harus diisi",
            invalid_type_error : "kode_jenis_pengadaan harus integer"
        }),
        is_kualifikasi_k : z.boolean().optional(),
        is_kualifikasi_m : z.boolean().optional(),
        is_kualifikasi_b : z.boolean().optional(),
        is_pembuka : z.boolean().optional(),
        teks_pembuka : z.string({
            invalid_type_error : "teks_pembuka harus string"
        }).optional(),
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
