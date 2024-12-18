import {z, object} from "zod"

const payloadItemTanya = {
    body : z.object({
        kode_jenis_vendor : z.number({
            required_error : "kode_jenis_vendor Harus Diisi",
            invalid_type_error : "kode_jenis_vendor harus Integer"
        }),
        kode_kat_dokumen_vendor : z.number({
            required_error : "Kode Kat Dokumen Vendor Harus Diisi",
            invalid_type_error : "Kode Kat Dokumen Vendor Harus Integer"
        }),
        kode_kat_item_tanya : z.number({
            required_error : "kode kat item tanya Harus Diisi",
            invalid_type_error : "kode kat item tanya Harus Integer"
        }),
        kode_tpl : z.number({
            required_error : "kode_tpl Harus Diisi",
            invalid_type_error : "kode_tpl Harus Integer"
        }),
        kode_trx_kategori : z.number({
            required_error : "kode_trx_kategori harus Diisi",
            invalid_type_error : "kode_trx_kategori Harus Integer"
        }),
        is_required : z.boolean({
            required_error : "Is Required Harus Diisi",
            invalid_type_error : "Is Required Boolean"
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




//Item Tanya
export const payloadItemTanyaSchema = object({
    ...payloadItemTanya
})

//Reusable

export const parameterSchema = object({
    ...parameter
})

//ItemTanya
export type PayloadItemTanyaSchema = z.TypeOf<typeof payloadItemTanyaSchema>

//Reusable

export type ParameterSchema = z.TypeOf<typeof parameterSchema>