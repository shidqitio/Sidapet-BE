import {z, object} from "zod"

const storeProfilVendor = {
    body : z.object({
        profil : z.array(z.object({
            kode_vendor : z.number({
                required_error : "Kode Vendor Harus Diisi",
                invalid_type_error : "Kode Vendor Harus Integer"
            }).optional(),
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
            invalid_type_error : "Kode Item Harus String",
        }),
        // kode_vendor : z.string({
        //     required_error : "Kode Vendor Harus Diisi",
        //     invalid_type_error : "Kode Vendor Harus String"
        // }).optional(),
        isian : z.string({
            invalid_type_error : "Isian Harus String"
        }).optional()
    })
}

const storeUploadSertifikat = {
    body : z.object({
        nm_sertif_orang : z.string({
            required_error : "Nama Sertif Harus Diisi",
            invalid_type_error : "Nama Sertif Harus String"
        })
    })
}

const storeUploadPengalamanOrang = {
    body : z.object({
        nm_pnglmn_org : z.string({
            required_error : "Nama Sertif Harus Diisi",
            invalid_type_error : "Nama Sertif Harus String"
        })
    })
}

const getJawabProfilVendor = {
    body : z.object({
        kode_vendor : z.number({
            required_error : "Kode Vendor Harus Diisi",
            invalid_type_error : "Kode Vendor Harus Integer"
        }).optional(),
        kode_kat_dokumen_vendor : z.number({
            required_error : "Kode Kat Dokumen Vendor Harus Diisi",
            invalid_type_error : "Kode Kat Dokumen Vendor Harus Integer"
        })
    })
}


const storeUploadKomisaris = {
    body : z.object({
        nm_komisaris : z.string({
            required_error : "nm_komisaris Tidak Boleh Kosong",
            invalid_type_error : "nm_komisaris Harus String"
        }),
        jbtn_komisaris : z.string({
            required_error : "jbtn_komisaris Tidak Boleh Kosong",
            invalid_type_error : "jbtn_komisaris Harus String"
        }),
        hp_komisaris : z.string({
            required_error : "hp_komisaris Tidak Boleh Kosong",
            invalid_type_error : "hp_komisaris Harus String"
        }),
        no_ktp_komisaris : z.string({
            required_error : "no_ktp_komisaris Tidak Boleh Kosong",
            invalid_type_error : "no_ktp_komisaris Harus String"
        }),
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

export const getJawabProfilVendorSchema = object({
    ...getJawabProfilVendor
})

export const storeUploadSertifikatSchema = object({
    ...storeUploadSertifikat
})

export const storeUploadPengalamanSchema = object({
    ...storeUploadPengalamanOrang
})

export const storeUploadKomisarisSchema = object({
    ...storeUploadKomisaris
})

export const updateKomisarisSchema = object({
    ...parameter,
    ...storeUploadKomisaris
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
export type GetJawabProfilVendorSchema = z.TypeOf<typeof getJawabProfilVendorSchema>
export type StoreUploadSertifikatSchema = z.TypeOf<typeof storeUploadSertifikatSchema>
export type StoreUploadPengalamanSchema = z.TypeOf<typeof storeUploadPengalamanSchema>
export type StoreUploadKomisarisSchema = z.TypeOf<typeof storeUploadKomisarisSchema>

export type UpdateKomisarisSchema = z.TypeOf<typeof updateKomisarisSchema>

//Reusable
export type QuerySchema = z.TypeOf<typeof querySchema>
export type ParameterSchema = z.TypeOf<typeof parameterSchema>