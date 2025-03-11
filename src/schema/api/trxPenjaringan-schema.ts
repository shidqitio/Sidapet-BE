import {z, object} from "zod"
import { metode_penjaringan, status_persetujuan } from "@models/trxPenjaringan-model"

const payloadTrxPenjaringan = {
    body : z.object({
        kode_trx_kategori : z.number({
            required_error : "Kode Trx Kategori Harus Diisi",
            invalid_type_error : "kode_trx_kategori harus number"
        }),
        nama_penjaringan : z.string({
            required_error : "nama_penjaringan harus diisi",
            invalid_type_error : "nama_penjaring harus string"
        }).optional(),
        metode : z.nativeEnum(metode_penjaringan)
        .refine((val) => Object.values(metode_penjaringan).includes(val), {
            message: "Invalid metode penjaringan. Harus Salah Satu Dari 'pengumuman' dan 'undangan'",
        }),
        is_kualifikasi_k : z.boolean(),
        is_kualifikasi_m : z.boolean(),
        is_kualifikasi_b : z.boolean(),
        status_persetujuan : z.nativeEnum(status_persetujuan)  
        .refine((val) => Object.values(status_persetujuan).includes(val), {
            message : "Invalid metode penjaringan. Harus Salah Satu Dari 'belum_diproses', 'proses','terima', dan tolak"
        }).optional(),
        undangan : z.array(z.object({
            nama : z.string({
                required_error : "nama harus diisi",
                invalid_type_error : "nama harus string"
            }),
            email : z.string({
                required_error : "email harus diisi",
                invalid_type_error : "email harus string"
            }).email("format harus email"),
            alamat : z.string({
                required_error : "alamat harus diisi",
                invalid_type_error : "alamat harus string"
            }),
            nama_pic : z.string({
                required_error : "nama_pic harus diisi",
                invalid_type_error : "nama_pic harus string"
            }),
            no_hp_wa : z.string({
                required_error : "nomor_handphone harus diisi",
                invalid_type_error : "nomor_handphone harus string"
            })
        })).optional()
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

export const payloadTrxPenjaringanSchema = object({
    ...payloadTrxPenjaringan
})

//Reusable

export const parameterSchema = object({
    ...parameter
})

export const querySchema = object({
    ...query
})

export type PayloadTrxPenjaringanSchema = z.TypeOf<typeof payloadTrxPenjaringanSchema>

//reusable

export type ParameterSchema = z.TypeOf<typeof parameterSchema>

export type QuerySchema = z.TypeOf<typeof querySchema>