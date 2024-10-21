import {z, object} from "zod"

const storeProfilVendor = {
    body : z.object({
        profil : z.array(z.object({
            kode_vendor : z.number({
                required_error : "Kode Vendor Harus Diisi",
                invalid_type_error : "Kode Vendor Harus Integer"
            }),
            kode_item : z.number({
                required_error : "Kode Item Harus Diisi",
                invalid_type_error : "Kode Item Harus Integer"
            }), 
            isian : z.string({
                invalid_type_error : "Isian Harus String"
            }).optional()
        }))
    })
}

const storeUploadVendor = {
    body : z.object({
        kode_item : z.string({
            required_error : "Kode Item Harus Diisi", 
            invalid_type_error : "Kode Item Harus Integer",
        }),
        kode_vendor : z.string({
            required_error : "Kode Vendor Harus Diisi",
            invalid_type_error : "Kode Vendor Harus Integer"
        }),
        isian : z.string({
            invalid_type_error : "Isian Harus String"
        }).optional()
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


export const storeProfilVendorSchema = object({
    ...storeProfilVendor
})

export const storeUploadVendorSchema = object({
    ...storeUploadVendor
})

//Reusable
export const querySchema = object({
    ...query
})

export const parameterSchema = object({
    ...parameter
})


export type StoreProfilVendorSchema = z.TypeOf<typeof storeProfilVendorSchema>
export type StoreUploadVendorSchema = z.TypeOf<typeof storeUploadVendorSchema>

//Reusable
export type QuerySchema = z.TypeOf<typeof querySchema>
export type ParameterSchema = z.TypeOf<typeof parameterSchema>