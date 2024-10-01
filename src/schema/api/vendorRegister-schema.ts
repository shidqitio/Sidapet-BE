import {object, z} from "zod"; 
import { StatusRegister } from "@models/registerVendor-model";

//Register Vendor
const payloadRegister = {
    body : z.object({
        kode_jenis_vendor : z.string({
            required_error    : "kode_jenis_vendor tidak boleh kosong",
            invalid_type_error: "kode_jenis_vendor harus String"
        }),
        nama_perusahaan   : z.string({
            required_error    : "nama_perusahaan tidak boleh kosong",
            invalid_type_error: "nama_perusahaan harus string"
        }).max(100, "nama_perusahaan maksimal 100 karakter"),
        email             : z.string({
            required_error    : "email tidak boleh kosong",
            invalid_type_error: "email harus string"
        }).email("harus diisi email"),
        password          : z.string({
            required_error    : "password tidak boleh kosong",
            invalid_type_error: "password harus string"
        }).min(8, "password minimal 8 karakter"),
        nomor_handphone   : z.string({
            required_error    : "nomor_handphone tidak boleh kosong",
            invalid_type_error: "nomor_handphone harus string"
        }).min(10, "nomor handphone minimal 10 karakter"),
        swafoto           : z.string({
            required_error    : "swafoto tidak boleh kosong",
            invalid_type_error: "swafoto harus string"
        }).optional(),
        // status_register: z.nativeEnum(StatusRegister)
        // .refine((val) => Object.values(StatusRegister).includes(val), {
        //     message: "Invalid status_verif. Harus Salah Satu Dari 'proses', 'terima' dan 'tolak'",
        // }),
        alasan_ditolak    : z.string({
            required_error    : "alasan_ditolak tidak boleh kosong",
            invalid_type_error: "alasan_ditolak harus string"
        }).optional(),
        user_verif        : z.string({
            required_error    : "user_verif tidak boleh kosong",
            invalid_type_error: "user_verif harus string"
        }).optional(),    
    })
}

const statusRegister = {
    body : z.object({
        status_register: z.nativeEnum(StatusRegister)
        .refine((val) => Object.values(StatusRegister).includes(val), {
            message: "Invalid status_verif. Harus Salah Satu Dari 'proses', 'terima' dan 'tolak'",
        }),
    })
}

const statusRegisterParams = {
    params : z.object({
        id: z.nativeEnum(StatusRegister)
        .refine((val) => Object.values(StatusRegister).includes(val), {
            message: "Invalid status_verif. Harus Salah Satu Dari 'proses', 'terima' dan 'tolak'",
        }),
    })
}

const paramsRegisterVendor = {
    params : z.object({
        kode_register_vendor : z.string({
            required_error : "kode_register_vendor Harus Diisi", 
            invalid_type_error : "kode_register_vendor Harus String"
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

//Register Vendor
export const payloadRegisterSchema = object({
    ...payloadRegister
})

export const paramsRegisterVendorSchema = object({
    ...paramsRegisterVendor
})

export const updateStatusRegisterSchema = object({
    ...parameter,
    ...statusRegister
})

export const getVendorRegisterByStatusRegister = object({
    ...query,
    ...parameter
})

export const paramaterStatusVendorSchema = object({
    ...statusRegisterParams
})


//Reusable
export const querySchema = object({
    ...query
})

export const parameterSchema = object({
    ...parameter
})

//Register Vendor
export type PayloadRegisterSchema = z.TypeOf<typeof payloadRegisterSchema>
export type ParamsRegisterVendorSchema = z.TypeOf<typeof paramsRegisterVendorSchema>
export type UpdateStatusRegisterSchema = z.TypeOf<typeof updateStatusRegisterSchema>

export type ParamaterStatusVendorSchema = z.TypeOf<typeof paramaterStatusVendorSchema>

//Reusable
export type QuerySchema = z.TypeOf<typeof querySchema>
export type ParameterSchema = z.TypeOf<typeof parameterSchema>