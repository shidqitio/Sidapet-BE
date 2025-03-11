import RegisterVendor, {RegisterVendorInput, RegisterVendorOutput, StatusRegister} from "@models/registerVendor-model";
import RegisterVendorHistory, { RegisterVendorHistoryInput } from "@models/registerVendorHistory-model";
import Vendor, { VendorOutput } from "@models/vendor-model";
import JenisVendor from "@models/jenisVendor-model";
import db from "@config/database";
import CustomError from "@middleware/error-handler";
import getConfig from "@config/dotenv";
import { QueryTypes, Op, literal } from "sequelize";
import bcrypt from "bcrypt"
import { removeByLastNameAplikasi } from "@utils/remove-file";
import faceRecognitionPernosalId from "@utils/facerecognition-personal-id"
import encryptImage from "@utils/encryptimage"
import decryptImage from "@utils/decryptimage"
import {checkEmail, registerExternal} from "@services/usman"
import logger, { errorLogger, debugLogger } from "@config/logger";
import CryptoJS from "crypto-js";


import { httpCode, responseStatus } from "@utils/prefix";

import fs from "fs"

import {sendMail} from '@utils/sendmail'

import {
    PayloadRegisterSchema, 
    ParamsRegisterVendorSchema,
    UpdateStatusRegisterSchema,
    QuerySchema,
    ParameterSchema,
    ParamaterStatusVendorSchema
} from "@schema/api/vendorRegister-schema"

import template from "@public/template/template-email"

import {encryptWithKey, decryptWithKey} from "@utils/generate-encrypt-decrypt"

import validate from "deep-email-validator";


//Get All Vendor 
const getAllVendor = async (
    page:QuerySchema["query"]["page"],
    limit:QuerySchema["query"]["limit"]) : Promise<{rows : RegisterVendorOutput[], count : number}> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
          offset = (pages - 1) * limits;
        }

        const {rows , count} = await RegisterVendor.findAndCountAll({
            attributes : {exclude : ["password", "udcr", "udch", "ucr", "uch","keypass", ]},
            include : [
                {
                    model : JenisVendor,
                    as : "JenisVendor",
                }
            ],
            limit : limits,
            offset : offset
        })

        return {rows, count}
    } catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

//Get All Vendor By Status Verif
const getVendorbyStatusVerifikasi = async (
    page:QuerySchema["query"]["page"],
    limit:QuerySchema["query"]["limit"], id : ParamaterStatusVendorSchema["params"]["id"]) : Promise<any> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
          offset = (pages - 1) * limits;
        }

        const {rows , count} = await RegisterVendor.findAndCountAll({
            where : {
                status_register : id,

            },
            attributes : {exclude : ["password", "udcr", "udch", "ucr", "uch","keypass" ]},
            include : [
                {
                    model : JenisVendor,
                    as : "JenisVendor",
                }
            ],
            limit : limits,
            offset : offset
        })

        const countDataProses = await RegisterVendor.count({
            where : {
                status_register : "proses"
            }
        })

        const countDataTerima = await RegisterVendorHistory.count({
            where : {
                status_register : "terima" 
            }
        })
        
        const countDataTolak = await RegisterVendorHistory.count({
            where : {
                status_register : "tolak"
            }
        })

        const resultData = {
            data_vendor : rows,
            count_proses : countDataProses,
            count_terima : countDataTerima,
            count_tolak : countDataTolak,
            count_data_show : count
        }

        const arr_data = []

        arr_data.push(resultData)

        return arr_data  



        return {rows, count}
    } catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

//Register Vendor
const registerVendor = async (request:PayloadRegisterSchema["body"], file : Express.Multer.File ) => {
    const t = await db.transaction()
    try {
        
        const {valid, reason, validators} = await validate(request.email)

        // console.log("TES VALID : ", valid)
        // console.log("REASON :" , reason)
        // console.log("VALIDATOR : ", validators)
        
        if(valid === false ) {
        await t.rollback()
        throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Email Tidak Valid")
        }
        const [exEmail, errorCheckEmail] : [any, string] = await checkEmail(request.email)

        if(errorCheckEmail) {
            await t.rollback()
            throw new CustomError(httpCode.serviceUnavailable, responseStatus.error, errorCheckEmail)
        }

        if(exEmail.length > 0) {
            await t.rollback()
            throw new CustomError(httpCode.conflict, responseStatus.success, "Email Sudah Terdaftar")
        }

        const exEmailSidapet : RegisterVendor | null = await RegisterVendor.findOne({
            where : {
                email : request.email
            },
            transaction : t
        })

        if(exEmailSidapet) {
            await t.rollback()
            throw new CustomError(httpCode.conflict, responseStatus.success, "Email Sudah Terdaftar")
        }

        const pw = await bcrypt.hash(request.password, 12)

        let fileImages : string = ""
        if(file && file.filename) {
            fileImages = `${file.filename}`
        }

        const req_input : RegisterVendorInput = {
            kode_jenis_vendor : parseInt(request.kode_jenis_vendor),
            nama_perusahaan : request.nama_perusahaan,
            email : request.email,
            password : pw,
            nomor_handphone : request.nomor_handphone,
            nama_narahubung : request.nama_narahubung,
            nomor_telp : request.nomor_telp,
            status_register : StatusRegister.proses,
            alasan_ditolak : request.alasan_ditolak,
            swafoto : fileImages
        }

        const createVendor:RegisterVendorOutput = await RegisterVendor.create(req_input, {transaction : t})

        if(!createVendor) {
            fs.unlinkSync(`${getConfig('SIDAPET_SAVED_FOTO')}/${fileImages}`)
            await t.rollback()
            throw new CustomError(httpCode.unprocessableEntity,"error", "Create Gagal Dibuat")
        }

        const encryptedImage = await encryptImage(file.path, `${getConfig("ENCRYPT_SAVE_FOTO")}/${file.filename}`, "Review Image")

        if(encryptedImage) {
            const updatedKeypassPic = await RegisterVendor.update({
                keypass : encryptedImage.keypass
            }, {
                where : {
                    email : request.email
                },
                transaction : t
            })
    
            if(updatedKeypassPic[0] === 0) {
                fs.unlinkSync(`${getConfig('ENCRYPT_SAVE_FOTO')}/${fileImages}`)
                throw new CustomError(httpCode.unprocessableEntity,responseStatus.error, "Terjadi Kegagalan Update ")
            }
        }

        // let idString = String(createVendor.kode_register)

        // let cipherText = encryptWithKey(idString, getConfig("SECRET_KEY"))

        // let kirimEmail = template.templateHtmlEmailVerif(`${getConfig("SIDAPET_BASE_URL")}/api-noauth/v1/vendor/register/verifikasi/${cipherText}`)
        

        // let sendEmail = await sendMail(createVendor.email as string, "Verifikasi Email Vendor",kirimEmail)

        // if(!sendEmail) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Kirim Email ke Vendor")



        await t.commit()

        if(createVendor) {
            if(file) {
                let face = await faceRecognitionPernosalId(file.path)
                
                if(!face) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "terjadi error pada face recognition")
                const updateFaceRecog = await RegisterVendor.update({
                    message : face.message,
                    similarity : face.similarity,
                    distance_percentage : face.distance_presentage,
                    distance_point  : face.distance_point
                }, {
                    where : {
                        email : request.email
                    }
                })

                if(updateFaceRecog[0] === 0 ) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Update Face Recog gagal")
            }
        }

        return createVendor
        
    } catch (error) {
        debugLogger.debug(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            
            throw new CustomError(500,responseStatus.error, "Internal server error.")
        }
    }
}


//Get Detail Vendor
const getRegisterVendorDetail = async (id:ParameterSchema["params"]["id"]) => {
    try {
        const vendorRegisterDetail : RegisterVendor | null = await RegisterVendor.findOne({
            attributes : {exclude : ["ucr","uch","udcr","udch", "password", "user_verif", "alasan_ditolak"]},
            where : {
                kode_register : id
            },
            raw : true
        })

        const vendorRegisterDetailView  : RegisterVendor | null= await RegisterVendor.findOne({
             attributes : [
                "kode_register",
                "kode_vendor",
                "kode_jenis_vendor",
                "nama_perusahaan",
                "email",
                "nomor_handphone",
                "status_register",
                "alasan_ditolak",
                "message",
                "user_verif",
                "similarity",
                "distance_percentage",
                "distance_point",
                "keypass",
            ],
            where : {
                 kode_register: id
            },
            include : [
                {
                    model : JenisVendor,
                    as : "JenisVendor",
                    attributes : ["kode_jenis_vendor", "jenis_vendor"]
                }
            ],
            raw : true,
            nest : true
        })



        if(!vendorRegisterDetail) throw new CustomError(httpCode.notFound, responseStatus.success, "Vendor Detail Tidak Ada")


        if(!vendorRegisterDetailView) throw new CustomError(httpCode.notFound, responseStatus.success, "Vendor Detail Tidak Ada")

        if(vendorRegisterDetail.swafoto) {
                let path : string = `${getConfig('ENCRYPT_SAVE_FOTO')}/${vendorRegisterDetail.swafoto}`

                
                
                const decrypt = await decryptImage(path, vendorRegisterDetailView.keypass)      
                    
                let combinedObject = {...vendorRegisterDetailView, ...decrypt}

                return combinedObject
        }

        const vendorRegisterResult : RegisterVendor | null = await RegisterVendor.findOne({
            attributes : [
                "kode_register",
                "kode_vendor",
                "kode_jenis_vendor",
                "nama_perusahaan",
                "email",
                "nomor_handphone",
                "status_register",
                "alasan_ditolak",
                "message",
                "user_verif",
                "similarity",
                "distance_percentage",
                "distance_point",
                "keypass",
            ],
            where : {
                kode_register : id
            }, 
            include : [
                {
                    model : JenisVendor, 
                    as : "JenisVendor",
                }
            ]
        })

        if(!vendorRegisterResult) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Tidak Ada")

        return vendorRegisterResult


    } catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.status,error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500,"error", "Internal server error.")
        }
    }
}


//Update Status Vendor
const updateStatusVendor = async (
    id:ParameterSchema["params"]["id"],
    status_register : UpdateStatusRegisterSchema["body"]["status_register"],
    alasan : string,
    uch : string | null 
) : Promise<RegisterVendorOutput> => {
    const t = await db.transaction()
    try {
        const exRegisterVendor : RegisterVendor | null = await RegisterVendor.findOne({
            where : {
                kode_register : id
            }, 
            transaction : t
        })

        if(!exRegisterVendor) throw new CustomError(httpCode.notFound, responseStatus.success, "Vendor Tidak Tersedia")


        const req_input : RegisterVendorHistoryInput = {
                kode_register : exRegisterVendor.kode_register,
                kode_jenis_vendor : exRegisterVendor.kode_jenis_vendor,
                nama_perusahaan : exRegisterVendor.nama_perusahaan,
                email : exRegisterVendor.email,
                swafoto : exRegisterVendor.swafoto,
                password : exRegisterVendor.password,
                nomor_handphone : exRegisterVendor.nomor_handphone,
                nama_narahubung : exRegisterVendor.nama_narahubung,
                nomor_telp : exRegisterVendor.nomor_telp,
                status_register : status_register,
                alasan_ditolak : alasan,
                user_verif : uch
            }
            
            const createRegisterHistory  = await RegisterVendorHistory.create(req_input, {
                transaction : t
            })
            

            if(!createRegisterHistory) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error,"Data History Gagal Diinput")    
        if(status_register === StatusRegister.tolak) {
            if(exRegisterVendor.swafoto) {
                fs.unlinkSync(`${getConfig('SIDAPET_SAVED_FOTO')}/${exRegisterVendor.swafoto}`)

                fs.unlinkSync(`${getConfig('ENCRYPT_SAVE_FOTO')}/${exRegisterVendor.swafoto}`)
            }

            let kirimEmail = template.templateHtmlEmailFailed(alasan)

            await sendMail(exRegisterVendor.email as string, "Pemberitahuan Registrasi",kirimEmail)

            const deleteVendor : number = await RegisterVendor.destroy({
                where : {
                    kode_register : id
                },
                transaction : t
            })

            if(deleteVendor === 0) {
                throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Delete Data")
            }

            let resultDitolak : any = {
                message : "Verifikasi Gagal Silahkan Register Ulang"
            }

            await t.commit()

            return resultDitolak
        }
        

        const createVendor : Vendor = await Vendor.create({
            kode_jenis_vendor : exRegisterVendor.kode_jenis_vendor,
            nama_perusahaan : exRegisterVendor.nama_perusahaan,
            is_tetap : false,
            is_email_verified : false
        },{transaction : t})

        if(!createVendor) {
            console.log(createVendor)
            throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Create Vendor")
        }

        const [updatedRows,[updatedData]] : [number,RegisterVendor[]] = await RegisterVendor.update({
            status_register : status_register,
            user_verif : uch,
            kode_vendor : createVendor.kode_vendor
        }, {
            where : {
                kode_register : id,
         
            },
            returning : true,
            transaction : t

        })


        if(updatedRows === 0){
            throw new CustomError(httpCode.unprocessableEntity,"error", "Update Gagal")
        }

         let idString = String(exRegisterVendor.kode_register)

        let cipherText = encryptWithKey(idString, getConfig("SECRET_KEY"))

        let tampil

        if(exRegisterVendor.kode_jenis_vendor === 1)  tampil = "Badan Usaha"

        else {
            tampil = "Perorangan"
        }

        let data_sendEmail = {
            nama_perusahaan : exRegisterVendor.nama_perusahaan,
            email : exRegisterVendor.email,
            no_wa : exRegisterVendor.nomor_handphone,
            jenis_penyedia : tampil,
            base_url : `${getConfig("SIDAPET_BASE_URL")}/verifikasi-akun?id=${cipherText}`
        }

        let kirimEmail = template.templateHtmlEmailVerif(data_sendEmail)

        
        
        
        //  `Registrasi Akun Anda Berhasil Silahkan klink link berikut : https://dinovalley.ut.ac.id/verifikasi-akun?id=${exRegisterVendor.kode_register}`

        await sendMail(exRegisterVendor.email as string, "Pemberitahuan Registrasi", kirimEmail)

        
        await t.commit()

        return updatedData
        
    } catch (error) {
        await t.rollback()
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.status,error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500,"error", "Internal server error.")
        }
    }
}

//Update Verifikasi Email 
const updateVerifEmail = async (kode_register:string) : Promise<any> => {
    try {

        
 // Decrypt
 const kode = decryptWithKey(kode_register, getConfig("SECRET_KEY"))

        const exEmail = await RegisterVendor.findOne({
            where : {
                kode_register : parseInt(kode),
            }
        })

        if(!exEmail) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Email Tidak Ditemukan")


         const updateResponse = await exEmail.save()

         let contentHtml

        if(!updateResponse) {
            contentHtml = template.validationEmail(false,"Gagal Verifikasi Email")
        } else {
            contentHtml = template.validationEmail(true, "Berhasil Verifikasi Email, Mohon Tunggu Verifikator memverifikasi Email")
        }

        return contentHtml

            
    } catch (error) {
        console.log("error : ", error);
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.status, error.message)
        } else {
            debugLogger.debug(error)
            throw new CustomError(500, "error", "Internal server error.")
        }
    }
}


//Register External to USMAN
const insertExternaltoUsman = async (
    id:ParameterSchema["params"]["id"]) : Promise<VendorOutput> => {
    const t = await db.transaction()
    try {

        const kode = decryptWithKey(id, getConfig("SECRET_KEY"))

        const exVendor : any = await Vendor.findOne({
            attributes : [
                "kode_vendor",
                "nama_perusahaan",
                "kode_jenis_vendor",
                [literal(`"RegisterVendor"."email"`), "email"],
                [literal(`"RegisterVendor","password"`), "password"]
            ],
            include : [
                {
                    model : RegisterVendor, 
                    as : "RegisterVendor",
                    where : {
                        status_register : StatusRegister.terima,
                        kode_register : kode
                    },
                    attributes : []
                }
            ],
            raw : true,
            transaction : t
        })

        if(!exVendor){
            throw new CustomError(httpCode.notFound,"success", "Vendor Tidak Terdaftar")
        }

        let statusPengguna : string

        if(exVendor.kode_jenis_vendor === 1 ) {
            statusPengguna = "perusahaan"
        } else {
            statusPengguna = "perorangan"
        }


        const [exEmail, errorCheckEmail] : [any, string] = await checkEmail(exVendor.email)
        
        if(errorCheckEmail) {

            throw new CustomError(httpCode.serviceUnavailable,"error", errorCheckEmail)
        }

        if(exEmail.length > 0   ){
            throw new CustomError(httpCode.conflict,"success", "Email Sudah Terdaftar")
        } 

        const [regisExternal, errorRegisterExternal] : [any, string] = await registerExternal({
            id : exVendor.id,
            email : exVendor.email,
            username : exVendor.nama_perusahaan,
            password : exVendor.password,
            statusPengguna : statusPengguna
        })

        
        if(errorRegisterExternal) {
            throw new CustomError(httpCode.serviceUnavailable,"error", errorRegisterExternal)
        }

        const updateVerifEmail = await Vendor.update({
            is_email_verified : true
        }, {
            where : {
                kode_vendor : exVendor.kode_vendor
            },
            transaction : t
        })

        if(updateVerifEmail[0] === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Pada Update Verifikasi Email")

        await t.commit()

        return regisExternal

    } catch (error) {
        await t.rollback()
        debugLogger.debug(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.status,error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500,"error", "Internal server error.")
        }
    }
}



//MIGRASI USER 
const migrasiUserUsman = async () : Promise<RegisterVendor[]> => {
    try {
        const vendorRegis : any = await RegisterVendor.findAll({
            attributes : [
                "kode_register",
                "kode_jenis_vendor",
                "nama_perusahaan",
                "email",
                "password",
                "Vendor.kode_vendor",

            ],
            limit : 5,
            include : [
                {
                    model : Vendor,
                    as : "Vendor"
                }
            ],
            raw : true,
            nest : true
        })

        if(vendorRegis.length === 0) throw new CustomError(httpCode.notFound, responseStatus.error, "Data Tidak Ada")

        const arr : any= []

        for(let x in vendorRegis) {
            let statusPengguna
            if(vendorRegis[x].kode_jenis_vendor === 1) {
                statusPengguna = "perusahaan"
            } else {
                statusPengguna = "perorangan"
            }

            if(!vendorRegis[x].email) {
                console.warn("Email Tidak Ditemukan", vendorRegis[x]);
                continue;
            }

            const [exEmail, errorCheckEmail] : [any, string] = await checkEmail(vendorRegis[x].email as string)
        
            if(errorCheckEmail) {
                console.warn("Error Check Email", vendorRegis[x].email)
                continue;
            }

            if(exEmail.length > 0   ){
                console.warn("Email Sudah Terdaftar", vendorRegis[x].email)
                continue;
            } 
            
            const [regisExternal, errorRegisterExternal] : [any, string] = await registerExternal({
                id : vendorRegis[x].kode_vendor,
                email : vendorRegis[x].email as string,
                username : vendorRegis[x].nama_perusahaan,
                password : vendorRegis[x].password,
                statusPengguna : statusPengguna
            })
    
            if(errorRegisterExternal) {
                console.warn("Email Gagal Dibuat Usman", vendorRegis[x].email)
                continue;
            }

            arr.push[regisExternal]
        }

        return arr

    } catch (error) {
        console.log(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.status,error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500,"error", "Internal server error.")
        }
    }
}

//Get All Vendor By Status Verif
const getVendorbyStatusVerifikasiSearch = async (
    page:QuerySchema["query"]["page"],
    limit:QuerySchema["query"]["limit"], id : ParamaterStatusVendorSchema["params"]["id"], search_input : string, jenis_vendor : string) : Promise<RegisterVendor | any> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
          offset = (pages - 1) * limits;
        }

        let findFilter

        //CEK JIKA ADA JENIS VENDOR 
        if(jenis_vendor !== "0" ) { 
                //CEK Status Register
                if(id === "proses") {
                    findFilter = await RegisterVendor.findAndCountAll({
                        where : {
                            status_register : id,
                            kode_jenis_vendor : jenis_vendor,
                            [Op.or] : {
                                nama_perusahaan : {
                                    [Op.like] : `%${search_input}%`
                                },
                                email : {
                                    [Op.like] : `%${search_input}%`
                                },
                                nomor_handphone : {
                                    [Op.like] : `%${search_input}%`
                                }
                            }
                        },
                        attributes : {exclude : ["password", "udcr", "udch", "ucr", "uch","keypass" ]},
                        include : [
                            {
                                model : JenisVendor,
                                as : "JenisVendor",
                            }
                        ],
                        limit : limits,
                        offset : offset
                    })
                } 
                else {
                    findFilter = await RegisterVendorHistory.findAndCountAll({
                        where : {
                            status_register : id,
                            kode_jenis_vendor : jenis_vendor,
                            [Op.or] : {
                                nama_perusahaan : {
                                    [Op.like] : `%${search_input}%`
                                },
                                email : {
                                    [Op.like] : `%${search_input}%`
                                },
                                nomor_handphone : {
                                    [Op.like] : `%${search_input}%`
                                }
                            }
                        },
                        attributes : {exclude : ["password", "udcr", "udch", "ucr", "uch","keypass" ]},
                        include : [
                            {
                                model : JenisVendor,
                                as : "JenisVendor",
                            }
                        ],
                        limit : limits,
                        offset : offset
                    })
                }
            }
            else {
                 //CEK Status Register
                if(id === "proses") {
                    findFilter = await RegisterVendor.findAndCountAll({
                        where : {
                            status_register : id,
                            [Op.or] : {
                                nama_perusahaan : {
                                    [Op.like] : `%${search_input}%`
                                },
                                email : {
                                    [Op.like] : `%${search_input}%`
                                },
                                nomor_handphone : {
                                    [Op.like] : `%${search_input}%`
                                }
                            }
                        },
                        attributes : {exclude : ["password", "udcr", "udch", "ucr", "uch","keypass" ]},
                        include : [
                            {
                                model : JenisVendor,
                                as : "JenisVendor",
                            }
                        ],
                        limit : limits,
                        offset : offset
                    })
                }
                else {
                    findFilter = await RegisterVendorHistory.findAndCountAll({
                        where : {
                            status_register : id,
                            [Op.or] : {
                                nama_perusahaan : {
                                    [Op.like] : `%${search_input}%`
                                },
                                email : {
                                    [Op.like] : `%${search_input}%`
                                },
                                nomor_handphone : {
                                    [Op.like] : `%${search_input}%`
                                }
                            }
                        },
                        attributes : {exclude : ["password", "udcr", "udch", "ucr", "uch","keypass" ]},
                        include : [
                            {
                                model : JenisVendor,
                                as : "JenisVendor",
                            }
                        ],
                        limit : limits,
                        offset : offset
                    })
                }
            }


            const countDataProses = await RegisterVendor.count({
                where : {
                    status_register : "proses"
                }
            })

            const countDataTerima = await RegisterVendorHistory.count({
                where : {
                    status_register : "terima" 
                }
            })
            
            const countDataTolak = await RegisterVendorHistory.count({
                where : {
                    status_register : "tolak"
                }
            })

            const {rows, count} = findFilter

            console.log(findFilter.rows)
           
            const resultData = {
                data_vendor : findFilter.rows,
                count_proses : countDataProses,
                count_terima : countDataTerima,
                count_tolak : countDataTolak,
                count_data_show : count
            }

            const arr_data = []

            arr_data.push(resultData)

            return arr_data  
    } 
    catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}




export default {
    getAllVendor, 
    getRegisterVendorDetail,
    getVendorbyStatusVerifikasi,
    updateStatusVendor,
    insertExternaltoUsman,
    registerVendor,
    migrasiUserUsman,
    getVendorbyStatusVerifikasiSearch,
    updateVerifEmail
}



