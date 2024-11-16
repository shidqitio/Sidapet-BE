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

//Sertifikat Perorangan
const storeUploadSertifikat = {
    body : z.object({
        nm_sertif_orang : z.string({
            required_error : "Nama Sertif Harus Diisi",
            invalid_type_error : "Nama Sertif Harus String"
        })
    })
}

//Pengalaman Perorangan
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


//Komisaris
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
        }).min(16, "Minimum 16 Angka"),
    })
}

//Direksi 
const payloadDireksi = {
    body : z.object({
        nm_direksi : z.string({
            required_error : "nm_komisaris Tidak Boleh Kosong",
            invalid_type_error : "nm_komisaris Harus String"
        }),
        jbtn_direksi : z.string({
            required_error : "jbtn_direksi Tidak Boleh Kosong",
            invalid_type_error : "jbtn_direksi Harus String"
        }),
        hp_direksi : z.string({
            invalid_type_error : "hp_direksi Harus String"
        }).optional(),
        no_ktp_direksi : z.string({
            invalid_type_error : "Ktp Direksi Harus String"
        })
    })
}

//Ijin Usaha
const payloadIjinUsaha = {
    body : z.object({
        nama_izin : z.string({
            required_error : "nama_izin Harus Diisi",
            invalid_type_error : "nama_izin Harus String"
        }),
        no_izin : z.string({
            required_error : "no_izin Harus Diisi",
            invalid_type_error : "no_izin Harus String"
        }),
        masa_izin : z.string({
            required_error : "masa_izin Harus Diisi",
            invalid_type_error : "masa_izin Harus String"
        }),
        pemberi_izin : z.string({
            required_error : "pemberi_izin Harus Diisi",
            invalid_type_error : "pemberi_izin Harus String"
        }),
        kualifikasi_usaha : z.string({
            required_error : "kualifikasi_usaha Harus Diisi",
            invalid_type_error : "kualifikasi_usaha Harus String"
        }),
        klasifikasi_usaha : z.string({
            required_error : "klasifikasi_usaha Harus Diisi",
            invalid_type_error : "klasifikasi_usaha Harus String"
        }).optional(),
        tdp : z.string({
            required_error : "tdp Harus Diisi",
            invalid_type_error : "tdp Harus String"
        }),
    })
}

const payloadSahamPerusahaan = {
    body : z.object({
        nm_saham : z.string({
            required_error : "nm_saham Harus Diisi",
            invalid_type_error : "nm_saham Harus String"
        }),
        no_ktp_saham : z.string({
            required_error : "no_ktp_saham Harus Diisi",
            invalid_type_error : "no_ktp_saham Harus String"
        }),
        alamat_saham : z.string({
            required_error : "alamat_saham Harus Diisi",
            invalid_type_error : "alamat_saham Harus String"
        }),
        persentase_saham : z.string({
            required_error : "persentase_saham Harus Diisi",
            invalid_type_error : "persentase_saham Harus String"
        }),
    })
}

const payloadPersonalia = {
    body : z.object({
        nm_personal : z.string({
            required_error : "nm_personal Harus Diisi",
            invalid_type_error : "nm_personal Harus String"
        }),
        tgl_personal : z.string({
            required_error : "tgl_personal Harus Diisi",
            invalid_type_error : "tgl_personal Harus String"
        }),
        pendidikan_personal : z.string({
            required_error : "pendidikan_personal Harus Diisi",
            invalid_type_error : "pendidikan_personal Harus String"
        }),
        jbtn_personal : z.string({
            required_error : "jbtn_personal Harus Diisi",
            invalid_type_error : "jbtn_personal Harus String"
        }),
        pengalaman_personal : z.string({
            required_error : "pengalaman_personal Harus Diisi",
            invalid_type_error : "pengalaman_personal Harus String"
        }),
        keahlian_personal : z.string({
            required_error : "keahlian_personal Harus Diisi",
            invalid_type_error : "keahlian_personal Harus String"
        }),
        sertif_personal : z.string({
            required_error : "sertif_personal Harus Diisi",
            invalid_type_error : "sertif_personal Harus String"
        }),
    })
}

const payloadFasilitas = {
    body : z.object({
        nm_fasilitas : z.string({
            required_error : "nm_fasilitas Harus Diisi",
            invalid_type_error : "nm_fasilitas Harus String"
        }),
        jumlah_fasilitas : z.string({
            required_error : "jumlah_fasilitas Harus Diisi",
            invalid_type_error : "jumlah_fasilitas Harus String"
        }),
        fasilitas_now : z.string({
            required_error : "fasilitas_now Harus Diisi",
            invalid_type_error : "fasilitas_now Harus String"
        }),
        merk_fasilitas : z.string({
            required_error : "merk_fasilitas Harus Diisi",
            invalid_type_error : "merk_fasilitas Harus String"
        }),
        tahun_fasilitas : z.string({
            required_error : "tahun_fasilitas Harus Diisi",
            invalid_type_error : "tahun_fasilitas Harus String"
        }),
        kondisi_fasilitas : z.string({
            required_error : "kondisi_fasilitas Harus Diisi",
            invalid_type_error : "kondisi_fasilitas Harus String"
        }),
        lokasi_fasilitas : z.string({
            required_error : "lokasi_fasilitas Harus Diisi",
            invalid_type_error : "lokasi_fasilitas Harus String"
        }),
    })
}

const payloadPengalaman = {
    body : z.object({
        nm_pnglmn : z.string({
            required_error : "nm_pnglmn Harus String",
            invalid_type_error : "nm_pnglmn Harus String"
        }),
        div_pnglmn : z.string({
            required_error : "div_pnglmn Harus String",
            invalid_type_error : "div_pnglmn Harus String"
        }),
        ringkas_pnglmn : z.string({
            required_error : "ringkas_pnglmn Harus String",
            invalid_type_error : "ringkas_pnglmn Harus String"
        }),
        lok_pnglmn : z.string({
            required_error : "lok_pnglmn Harus String",
            invalid_type_error : "lok_pnglmn Harus String"
        }),
        pemberi_pnglmn : z.string({
            required_error : "pemberi_pnglmn Harus String",
            invalid_type_error : "pemberi_pnglmn Harus String"
        }),
        alamat_pnglmn : z.string({
            required_error : "alamat_pnglmn Harus String",
            invalid_type_error : "alamat_pnglmn Harus String"
        }),
        tgl_pnglmn : z.string({
            required_error : "tgl_pnglmn Harus String",
            invalid_type_error : "tgl_pnglmn Harus String"
        }),
        nilai_pnglmn : z.string({
            required_error : "nilai_pnglmn Harus String",
            invalid_type_error : "nilai_pnglmn Harus String"
        }),
        status_pnglmn : z.string({
            required_error : "status_pnglmn Harus String",
            invalid_type_error : "status_pnglmn Harus String"
        }),
        tgl_selesai_pnglmn : z.string({
            required_error : "tgl_selesai_pnglmn Harus String",
            invalid_type_error : "tgl_selesai_pnglmn Harus String"
        }),
        ba_pnglmn : z.string({
            required_error : "ba_pnglmn Harus String",
            invalid_type_error : "ba_pnglmn Harus String"
        }),
    })
}

const payloadPengalamanSekarang = {
    body : z.object({
        nm_pnglmn_sekarang : z.string({
            required_error : "nm_pnglmn_sekarang Harus String",
            invalid_type_error : "nm_pnglmn_sekarang Harus String"
        }),
        div_pnglmn_sekarang : z.string({
            required_error : "div_pnglmn_sekarang Harus String",
            invalid_type_error : "div_pnglmn_sekarang Harus String"
        }),
        ringkas_pnglmn_sekarang : z.string({
            required_error : "ringkas_pnglmn_sekarang Harus String",
            invalid_type_error : "ringkas_pnglmn_sekarang Harus String"
        }),
        lok_pnglmn_sekarang : z.string({
            required_error : "lok_pnglmn_sekarang Harus String",
            invalid_type_error : "lok_pnglmn_sekarang Harus String"
        }),
        pemberi_pnglmn_sekarang : z.string({
            required_error : "pemberi_pnglmn_sekarang Harus String",
            invalid_type_error : "pemberi_pnglmn_sekarang Harus String"
        }),
        alamat_pnglmn_sekarang : z.string({
            required_error : "alamat_pnglmn_sekarang Harus String",
            invalid_type_error : "alamat_pnglmn_sekarang Harus String"
        }),
        tgl_pnglmn_sekarang : z.string({
            required_error : "tgl_pnglmn_sekarang Harus String",
            invalid_type_error : "tgl_pnglmn_sekarang Harus String"
        }),
        nilai_pnglmn_sekarang : z.string({
            required_error : "nilai_pnglmn_sekarang Harus String",
            invalid_type_error : "nilai_pnglmn_sekarang Harus String"
        }),
        status_pnglmn_sekarang : z.string({
            required_error : "status_pnglmn_sekarang Harus String",
            invalid_type_error : "status_pnglmn_sekarang Harus String"
        }),
        kontrak_pnglmn_sekarang : z.string({
            required_error : "kontrak_pnglmn_sekarang Harus String",
            invalid_type_error : "kontrak_pnglmn_sekarang Harus String"
        }),
        prestasi_pnglmn_sekarang : z.string({
            required_error : "prestasi_pnglmn_sekarang Harus String",
            invalid_type_error : "prestasi_pnglmn_sekarang Harus String"
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

export const payloadDireksiSchema = object({
    ...payloadDireksi
})

export const payloadUploadDireksiSchema = object({
    ...parameter,
    ...payloadDireksi
})

export const payloadSahamPerusahaanSchema = object({
    ...payloadSahamPerusahaan
})

export const payloadSahamPerusahaanUpdateSchema = object({
    ...parameter,
    ...payloadSahamPerusahaan
})


export const payloadIjinUsahaSchema = object({
    ...payloadIjinUsaha
})

export const payloadIjinUsahaUpdateSchema = object({
    ...parameter,
    ...payloadIjinUsaha
})

export const payloadPersonaliaSchema = object({
    ...payloadPersonalia
})

export const payloadPersonaliaUpdateSchema = object({
    ...parameter,
    ...payloadPersonalia
})

export const payloadFasilitasSchema = object({
    ...payloadFasilitas
})

export const payloadFasilitasUpdateSchema = object({
    ...parameter,
    ...payloadFasilitas
})

export const payloadPengalamanSchema = object({
    ...payloadPengalaman
})

export const payloadPengalamanUpdateSchema = object({
    ...parameter,
    ...payloadPengalaman
})

export const payloadPengalamanSekarangSchema = object({
    ...payloadPengalamanSekarang
})

export const payloadPengalamanSekarangUpdateSchema = object({
    ...parameter,
    ...payloadPengalamanSekarang
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

export type PayloadDireksiSchema = z.TypeOf<typeof payloadDireksiSchema>
export type PayloadUpdateDireksiSchema = z.TypeOf<typeof payloadUploadDireksiSchema>

export  type PayloadIjinUsaha = z.TypeOf<typeof payloadIjinUsahaSchema>
export type PayloadIjinUsahaUpdateSchema = z.TypeOf<typeof payloadIjinUsahaUpdateSchema>

export type PayloadSahamPerusahaanSchema = z.TypeOf<typeof payloadSahamPerusahaanSchema>
export type PayloadSahamPerusahaanUpdateSchema = z.TypeOf<typeof payloadSahamPerusahaanUpdateSchema>

export type PayloadPersonaliaSchema = z.TypeOf<typeof payloadPersonaliaSchema>
export type PayloadPersonaliaUpdateSchema = z.TypeOf<typeof payloadPersonaliaUpdateSchema>

export type PayloadFasilitasSchema = z.TypeOf<typeof payloadFasilitasSchema>
export type PayloadFasilitasUpdateSchema = z.TypeOf<typeof payloadFasilitasUpdateSchema>

export type PayloadPengalamanSchema = z.TypeOf<typeof payloadPengalamanSchema>
export type PayloadPengalamanUpdateSchema = z.TypeOf<typeof payloadPengalamanUpdateSchema>

export type PayloadPengalamanSekarangSchema = z.TypeOf<typeof payloadPengalamanSekarangSchema>
export type PayloadPengalamanSekarangUpdateSchema = z.TypeOf<typeof payloadPengalamanSekarangUpdateSchema>

//Reusable

export type QuerySchema = z.TypeOf<typeof querySchema>
export type ParameterSchema = z.TypeOf<typeof parameterSchema>