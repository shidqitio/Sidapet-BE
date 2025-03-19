import {z, object} from "zod"

import { jenis_izin_usaha } from "@models/ijinUsahaPerusahaan-model"
import { kondisi } from "@models/fasilitasPerusahaan-model"

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

//Perorangan
//PENGALAMAN PERORANGAN BARU 
const payloadStoreUploadPengalamanPerorangan = {
    body : z.object({
        nama_pekerjaan : z.string({
            required_error : "nama_pekerjaan harus diisi",
            invalid_type_error : "nama_pekerjaan harus string"
        }),
        posisi : z.string({
            required_error : "posisi harus diisi",
            invalid_type_error : "posisi harus string"
        }),
        jangka_waktu : z.string({
            required_error : "jangka_waktu harus diisi",
            invalid_type_error : "jangka_waktu harus string"
        }),
        nilai_pekerjaan : z.string({
            required_error : "nilai_pekerjaan harus diisi",
            invalid_type_error : "nilai_pekerjaan harus string"
        }),
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

//Sertifikat
const payloadStoreUploadSertifikatPerorangan = {
    body : z.object({
        nm_sertif : z.string({
            required_error : "nm_sertif tidak boleh kosong",
            invalid_type_error : "nm_sertif harus string"
        })
    })
}


//BADAN USAHA
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
        is_ktp_selamanya : z.string({
            invalid_type_error : "is_ktp_selamanya harus string"
        }),
        ktp_berlaku_awal : z.string({
            invalid_type_error : "Ktp_berlaku_awal harus string"
        }).optional(),
        ktp_berlaku_akhir : z.string({
            invalid_type_error : "ktp_berlaku_akhir harus string"
        }).optional()
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
        }).min(16, "Minimum 16 Angka"),
        is_ktp_selamanya : z.string({
            invalid_type_error : "is_ktp_selamanya harus string"
        }),
        ktp_berlaku_awal : z.string({
            invalid_type_error : "Ktp_berlaku_awal harus string"
        }).optional(),
        ktp_berlaku_akhir : z.string({
            invalid_type_error : "ktp_berlaku_akhir harus string"
        }).optional()
    })
}

//Ijin Usaha
const payloadIjinUsaha = {
    body : z.object({
        nama : z.string({
            required_error : "nama Harus Diisi",
            invalid_type_error : "nama Harus String"
        }),
        jenis_izin_usaha : z.nativeEnum(jenis_izin_usaha)
        .refine((val) => Object.values(jenis_izin_usaha).includes(val), {
            message : "Invalid Jenis Izin Usaha, harus salah satu dari 'NIB' / 'SBU' "
        }),
        nomor_izin : z.string({
            required_error : "nomor_izin Harus Diisi",
            invalid_type_error : "nomor_izin Harus String"
        }).max(150),
        kode : z.string({
            required_error : "kode Harus Diisi",
            invalid_type_error : "kode Harus String"
        }).max(150),
        judul : z.string({
            required_error : "judul Harus Diisi",
            invalid_type_error : "judul Harus String"
        }),
        is_izin_selamanya : z.string({
            required_error : "is_izin_selamanya harus diisi"
        }),
        izin_berlaku_awal : z.string({
            invalid_type_error : "izin_berlaku_awal diisi string"
        }).optional(),
        izin_berlaku_akhir : z.string({
            invalid_type_error : "izin_berlaku_akhir diisi string"
        }).optional()
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
        is_saham_selamanya : z.string({
            invalid_type_error : "is_saham_selamany harus string"
        }),
        saham_berlaku_awal : z.string({
            invalid_type_error : "saham_berlaku_awal harus string"
        }),
        saham_berlaku_akhir : z.string({
            invalid_type_error : "saham_berlaku_akhir harus string"
        })
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
        nama : z.string({
            required_error : "nama harus diisi",
            invalid_type_error : "nama tidak boleh kosong"
        }),
        jumlah : z.string({
            required_error : "jumlah harus diisi",
            invalid_type_error : "jumlah tidak boleh kosong"
        }),
        kondisi : z.nativeEnum(kondisi)
        .refine((val) => Object.values(kondisi).includes(val), {
            message : "Invalid Kondisi, harus salah satu dari 'baik' / 'sedang' / 'kurang_baik' "
        }),
        kode_kepemilikan : z.string({
            required_error : "kode_kepemilikan harus diisi",
            invalid_type_error : "kode_kepemilikan tidak boleh kosong"
        }),
        // file_kepemilikan : z.string({
        //     required_error : "file_kepemilikan harus diisi",
        //     invalid_type_error : "file_kepemilikan tidak boleh kosong"
        // }),
        is_kepemilikan_selamanya : z.string({
            required_error : "is_kepemilikan_selamanya harus diisi",
            invalid_type_error : "is_kepemilikan_selamanya tidak boleh kosong"
        }),
        kepemilikan_berlaku_awal : z.string({
            required_error : "kepemilikan_berlaku_awal harus diisi",
            invalid_type_error : "kepemilikan_berlaku_awal tidak boleh kosong"
        }).optional(),
        kepemilikan_berlaku_akhir : z.string({
            required_error : "kepemilikan_berlaku_akhir harus diisi",
            invalid_type_error : "kepemilikan_berlaku_akhir tidak boleh kosong"
        }).optional(),
        // file_foto : z.string({
        //     required_error : "file_foto harus diisi",
        //     invalid_type_error : "file_foto tidak boleh kosong"
        // }),
        is_foto_selamanya : z.string({
            required_error : "is_foto_selamanya harus diisi",
            invalid_type_error : "is_foto_selamanya tidak boleh kosong"
        }),
        foto_berlaku_awal : z.string({
            required_error : "foto_berlaku_awal harus diisi",
            invalid_type_error : "foto_berlaku_awal tidak boleh kosong"
        }).optional(),
        foto_berlaku_akhir : z.string({
            required_error : "foto_berlaku_akhir harus diisi",
            invalid_type_error : "foto_berlaku_akhir tidak boleh kosong"
        }).optional() 
    })
}

const payloadPengalaman = {
    body : z.object({
        nama_pekerjaan : z.string({
            required_error : "nama_pekerjaan Harus String",
            invalid_type_error : "nama_pekerjaan Harus String"
        }),
        tahun_pekerjaan : z.string({
            required_error : "tahun_pekerjaan Harus String",
            invalid_type_error : "tahun_pekerjaan Harus String"
        }),
        pemberi_kerja : z.string({
            required_error : "pemberi_kerja Harus String",
            invalid_type_error : "pemberi_kerja Harus String"
        }),
        nilai_pekerjaan : z.string({
            required_error : "nilai_pekerjaan Harus String",
            invalid_type_error : "nilai_pekerjaan Harus String"
        }),
        jangka_waktu : z.string({
            required_error : "jangka_waktu Harus String",
            invalid_type_error : "jangka_waktu Harus String"
        }),
        no_kontrak : z.string({
            required_error : "no_kontrak Harus String",
            invalid_type_error : "no_kontrak Harus String"
        }),
        is_kontrak_selamanya : z.string({
            required_error : "is_kontrak_selamanya Harus String",
            invalid_type_error : "is_kontrak_selamanya Harus String"
        }),
        kontrak_berlaku_awal : z.string({
            required_error : "kontrak_berlaku_awal Harus String",
            invalid_type_error : "kontrak_berlaku_awal Harus String"
        }).optional(),
        kontrak_berlaku_akhir : z.string({
            required_error : "kontrak_berlaku_akhir Harus String",
            invalid_type_error : "kontrak_berlaku_akhir Harus String"
        }).optional(),
        is_bast_selamanya : z.string({
            required_error : "is_bast_selamanya Harus String",
            invalid_type_error : "is_bast_selamanya Harus String"
        }),
        bast_berlaku_awal : z.string({
            required_error : "bast_berlaku_awal Harus String",
            invalid_type_error : "bast_berlaku_awal Harus String"
        }).optional(),
        bast_berlaku_akhir : z.string({
            required_error : "bast_berlaku_akhir Harus String",
            invalid_type_error : "bast_berlaku_akhir Harus String"
        }).optional(),
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

//Kantor
const payloadKantor = {
    body : z.object({
        alamat : z.string({
            required_error : "Alamat harus diisi",
            invalid_type_error : "Alamat harus string"
        }),
        kode_kepemilikan : z.string({
            required_error : "Kode Kepemilikan Harus Diisi",
            invalid_type_error : "kode kepemilikan harus string"
        }),
        is_foto_selamanya : z.string({
            required_error : "is_foto_selamanya harus diisi",
            invalid_type_error : "is_foto_selamanya harus_string"
        }),
        foto_berlaku_awal : z.string({
            invalid_type_error : "foto_berlaku_awal harus string"
        }),
        foto_berlaku_akhir : z.string({
            invalid_type_error : "foto_berlaku_akhir harus string"
        }),
    })
}

//Tenaga Ahli
const payloadTenagaAhli = {
    body : z.object({
        nama : z.string ({
            required_error : "nama harus diisi",
            invalid_type_error : "nama harus string"
        }),
        no_ktp : z.string ({
            required_error : "no_ktp harus diisi",
            invalid_type_error : "no_ktp harus string"
        }).max(20),
        is_ktp_selamanya : z.string ({
            required_error : "is_ktp_selamanya harus diisi",
            invalid_type_error : "is_ktp_selamanya harus string"
        }),
        ktp_berlaku_awal : z.string ({
            invalid_type_error : "ktp_berlaku_awal harus string"
        }).optional(),
        ktp_berlaku_akhir : z.string ({
            required_error : "ktp_berlaku_akhir harus diisi",
            invalid_type_error : "ktp_berlaku_akhir harus string"
        }).optional(),
        tempat_lahir : z.string ({
            required_error : "tempat_lahir harus diisi",
            invalid_type_error : "tempat_lahir harus string"
        }),
        tgl_lahir : z.string ({
            required_error : "tgl_lahir harus diisi",
            invalid_type_error : "tgl_lahir harus string"
        }),
        posisi : z.string ({
            required_error : "posisi harus diisi",
            invalid_type_error : "posisi harus string"
        }),
        kode_jenjang_pendidikan : z.string ({
            required_error : "kode_jenjang_pendidikan harus diisi",
            invalid_type_error : "kode_jenjang_pendidikan harus string"
        }),
        program_studi : z.string ({
            required_error : "program_studi harus diisi",
            invalid_type_error : "program_studi harus string"
        }),
        is_ijazah_selamanya : z.string ({
            required_error : "is_ijazah_selamanya harus diisi",
            invalid_type_error : "is_ijazah_selamanya harus string"
        }),
        ijazah_berlaku_awal : z.string ({
            invalid_type_error : "ijazah_berlaku_awal harus string"
        }).optional(),
        ijazah_berlaku_akhir : z.string ({
            invalid_type_error : "ijazah_berlaku_akhir harus string"
        }).optional(),
        is_cv_selamanya : z.string ({
            required_error : "is_cv_selamanya harus diisi",
            invalid_type_error : "is_cv_selamanya harus string"
        }),
        cv_berlaku_awal : z.string ({
            invalid_type_error : "cv_berlaku_awal harus string"
        }).optional(),
        cv_berlaku_akhir : z.string ({
            invalid_type_error : "cv_berlaku_akhir harus string"
        }).optional(),
    })
}

//Tenaga Pendukung
const payloadTenagaPendukung = {
    body : z.object({
        nama : z.string ({
            required_error : "nama harus diisi",
            invalid_type_error : "nama harus string"
        }),
        no_ktp : z.string ({
            required_error : "no_ktp harus diisi",
            invalid_type_error : "no_ktp harus string"
        }).max(20),
        is_ktp_selamanya : z.string ({
            required_error : "is_ktp_selamanya harus diisi",
            invalid_type_error : "is_ktp_selamanya harus string"
        }),
        ktp_berlaku_awal : z.string ({
            invalid_type_error : "ktp_berlaku_awal harus string"
        }).optional(),
        ktp_berlaku_akhir : z.string ({
            invalid_type_error : "ktp_berlaku_akhir harus string"
        }).optional(),
        tempat_lahir : z.string ({
            required_error : "tempat_lahir harus diisi",
            invalid_type_error : "tempat_lahir harus string"
        }),
        tgl_lahir : z.string ({
            required_error : "tgl_lahir harus diisi",
            invalid_type_error : "tgl_lahir harus string"
        }),
        posisi : z.string ({
            required_error : "posisi harus diisi",
            invalid_type_error : "posisi harus string"
        }),
        kode_jenjang_pendidikan : z.string ({
            required_error : "kode_jenjang_pendidikan harus diisi",
            invalid_type_error : "kode_jenjang_pendidikan harus string"
        }),
        program_studi : z.string ({
            required_error : "program_studi harus diisi",
            invalid_type_error : "program_studi harus string"
        }),
        is_ijazah_selamanya : z.string ({
            required_error : "is_ijazah_selamanya harus diisi",
            invalid_type_error : "is_ijazah_selamanya harus string"
        }),
        ijazah_berlaku_awal : z.string ({
            invalid_type_error : "ijazah_berlaku_awal harus string"
        }).optional(),
        ijazah_berlaku_akhir : z.string ({
            invalid_type_error : "ijazah_berlaku_akhir harus string"
        }).optional(),
        is_cv_selamanya : z.string ({
            required_error : "is_cv_selamanya harus diisi",
            invalid_type_error : "is_cv_selamanya harus string"
        }),
        cv_berlaku_awal : z.string ({
            invalid_type_error : "cv_berlaku_awal harus string"
        }).optional(),
        cv_berlaku_akhir : z.string ({
            invalid_type_error : "cv_berlaku_akhir harus string"
        }).optional(),
    })
}

//PengalamanTA 
const payloadPengalamanTa = {
    body : z.object({
        kode_tenaga_ahli : z.string({
            required_error : "kode_tenaga_ahli harus diisi"
        }),
        pengalaman_data : z.array(z.object({
            pengalaman : z.string({
                required_error : "pengalaman Tidak Boleh Kosong",
                invalid_type_error : "pengalaman harus string"
            }),
        }))
    })
}

const payloadPengalamanTaSatuan = {
    body : z.object({
        kode_tenaga_ahli : z.string({
            required_error : "kode_tenaga_ahli tidak boleh kosong",
            invalid_type_error : "kode_tenaga_ahli harus string"
        }),
        pengalaman : z.string({
            required_error : "pengalaman tidak boleh kosong",
            invalid_type_error : "pengalaman harus string"
        })
    })
}

//PengalamanTP
const payloadPengalamanTp = {
    body : z.object({
        kode_tenaga_pendukung : z.string({
            required_error : "kode_tenaga_ahli harus diisi"
        }),
        pengalaman_data : z.array(z.object({
            pengalaman : z.string({
                required_error : "pengalaman Tidak Boleh Kosong",
                invalid_type_error : "pengalaman harus string"
            }),
        }))
    })
}

const payloadPengalamanTpSatuan = {
    body : z.object({
        kode_tenaga_pendukung : z.string({
            required_error : "kode_tenaga_ahli tidak boleh kosong",
            invalid_type_error : "kode_tenaga_ahli harus string"
        }),
        pengalaman : z.string({
            required_error : "pengalaman tidak boleh kosong",
            invalid_type_error : "pengalaman harus string"
        })
    })
}

// Sertifikat TA
const payloadSertifikatTA = {
    body : z.object({
        kode_tenaga_ahli : z.string({
            required_error : "Kode Tenaga Ahli harus string",
            invalid_type_error : "kode_tenaga_ahli harus string"
        }),
        sertifikat_data : z.array(z.object({
            sertifikat : z.string({
                required_error : "sertifikat Tidak Boleh Kosong",
                invalid_type_error : "sertifikat harus string"
            }),
        }))
    })
}

const payloadSertifikatTASatuan = {
    body : z.object({
        kode_tenaga_ahli : z.string({
            required_error : "Kode Tenaga Ahli harus diisi",
            invalid_type_error : "kode_tenaga_ahli harus string"
        }),
        sertifikat : z.string({
            required_error : "sertifikat harus diisi",
            invalid_type_error : "sertifikat harus string"
        })
    })
}

// Sertifikat TP
const payloadSertifikatTP = {
    body : z.object({
        kode_tenaga_pendukung : z.string({
            required_error : "Kode Tenaga Ahli harus string",
            invalid_type_error : "kode_tenaga_ahli harus string"
        }),
        sertifikat_data : z.array(z.object({
            sertifikat : z.string({
                required_error : "sertifikat Tidak Boleh Kosong",
                invalid_type_error : "sertifikat harus string"
            }),
        }))
    })
}

const payloadSertifikatTPSatuan = {
    body : z.object({
        kode_tenaga_pendukung : z.string({
            required_error : "Kode Tenaga Ahli harus diisi",
            invalid_type_error : "kode_tenaga_ahli harus string"
        }),
        sertifikat : z.string({
            required_error : "sertifikat harus diisi",
            invalid_type_error : "sertifikat harus string"
        })
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

export const payloadStoreUploadPengalamanPeroranganSchema = object({
    ...payloadStoreUploadPengalamanPerorangan
})

export const payloadStoreUploadSertifikatPeroranganSchema = object({
    ...payloadStoreUploadSertifikatPerorangan
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

export const payloadKantorSchema = object({
    ...payloadKantor
})

export const payloadKantorUpdateSchema = object({
    ...parameter,
    ...payloadKantor
})

export const payloadTenagaAhliSchema = object({
    ...payloadTenagaAhli
})

export const payloadTenagaAhliUpdateSchema = object({
    ...parameter,
    ...payloadTenagaAhli
})

export const payloadTenagaPendukungSchema = object({
    ...payloadTenagaPendukung
})

export const payloadTenagaPendukungUpdateSchema = object({
    ...parameter,
    ...payloadTenagaPendukung
})

export const payloadPengalamanTaSchema = object({
    ...payloadPengalamanTa
})
export const payloadPengalamanTaSatuanScehma = object({
    ...payloadPengalamanTaSatuan
})

export const payloadPengalamanTpSchema = object({
    ...payloadPengalamanTp
})
export const payloadPengalamanTpSatuanScehma = object({
    ...payloadPengalamanTpSatuan
})

export const payloadSertifikatTASchema = object({
    ...payloadSertifikatTA
})
export const payloadSertifikatTASatuanSchema = object({
    ...payloadSertifikatTASatuan
})

export const payloadSertifikatTPSchema = object({
    ...payloadSertifikatTP
})
export const payloadSertifikatTPSatuanSchema = object({
    ...payloadSertifikatTPSatuan
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

export type PayloadStoreUploadPengalamanPeroranganSchema = z.TypeOf<typeof payloadStoreUploadPengalamanPeroranganSchema>
export type PayloadStoreUploadSertifikatPeroranganSchema = z.TypeOf<typeof payloadStoreUploadSertifikatPeroranganSchema>

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

export type PayloadKantorSchema = z.TypeOf<typeof payloadKantorSchema>
export type PayloadKantorUpdateSchema = z.TypeOf<typeof payloadKantorUpdateSchema>

export type PayloadTenagaAhliSchema = z.TypeOf<typeof payloadTenagaAhliSchema>
export type PayloadTenagaAhliUpdateSchema = z.TypeOf<typeof payloadTenagaAhliUpdateSchema>

export type PayloadTenagaPendukungSchema = z.TypeOf<typeof payloadTenagaPendukungSchema>
export type PayloadTenagaPendukungUpdateSchema = z.TypeOf<typeof payloadTenagaPendukungUpdateSchema>

export type PayloadPengalamanTaSchema = z.TypeOf<typeof payloadPengalamanTaSchema>
export type PayloadPengalamanTaSatuanSchema = z.TypeOf<typeof payloadPengalamanTaSatuanScehma>

export type PayloadPengalamanTpSchema = z.TypeOf<typeof payloadPengalamanTpSchema>
export type PayloadPengalamaTpSatuanSchema = z.TypeOf<typeof payloadPengalamanTpSatuanScehma>


export type PayloadSertifikatTASchema = z.TypeOf<typeof payloadSertifikatTASchema>
export type PayloadSertifikatTASatuanSchema = z.TypeOf<typeof payloadSertifikatTASatuanSchema>



export type PayloadSertifikatTPSchema = z.TypeOf<typeof payloadSertifikatTPSchema>
export type PayloadSertifikatTPSatuanSchema = z.TypeOf<typeof payloadSertifikatTPSatuanSchema>




//Reusable

export type QuerySchema = z.TypeOf<typeof querySchema>
export type ParameterSchema = z.TypeOf<typeof parameterSchema>