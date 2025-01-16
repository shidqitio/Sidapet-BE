import CustomError from "@middleware/error-handler";
import { debugLogger } from "@config/logger";
import db from "@config/database";
import { responseStatus, httpCode } from "@utils/prefix";

//Import Model 
import TrxKategori from "@models/trxKategori-model";
import Kategori from "@models/kategori-model";
import JenisPengadaan from "@models/jenisPengadaan-model";
import TrxKatJVendor from "@models/trxKatJVendor-model";

//Import Schema 
import {
     PayloadTrxKategoriSchema,
     ParameterSchema,
     QuerySchema
} from "@schema/api/trxKategori-schema"
import JenisVendor from "@models/jenisVendor-model";

const getListKategori = async (
    limit:QuerySchema["query"]["limit"],
    page :QuerySchema["query"]["page"]) : Promise<{rows : TrxKategori[], count : number}> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
        offset = (pages - 1) * limits;
        }

        const {rows, count} = await TrxKategori.findAndCountAll({
            limit : limits,
            offset : offset,
            attributes : [
                "kode_trx_kategori",
                "Kategori.nama_kategori",
                "status_pengajuan_kat"
            ],
            include : [
                {
                    model : Kategori,
                    as : "Kategori",
                    attributes : []
                }, 
            ],
            raw : true,
            nest : true
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

const storeTrxKategori = async (request:PayloadTrxKategoriSchema["body"]) : Promise<any> => {
    const t = await db.transaction()
    try {
        const exKategori = await Kategori.findOne({
            where : {
                kode_kategori : request.kode_kategori
            },
            transaction : t
        })

        if(!exKategori) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Tidak Tersedia")

        const exJenisPengadaan = await JenisPengadaan.findOne({
            where : {
                kode_jenis_pengadaan : request.kode_jenis_pengadaan
            },
            transaction : t
        })

        if(!exJenisPengadaan) throw new CustomError(httpCode.notFound, responseStatus.success, "Data Tidak Tersedia")

        const trxKategoriStore = await TrxKategori.create({
            kode_kategori : request.kode_kategori,
            keperluan : request.keperluan,
            kode_jenis_pengadaan : request.kode_jenis_pengadaan,
            is_kualifikasi_b : request.is_kualifikasi_b,
            is_kualifikasi_k : request.is_kualifikasi_k,
            is_kualifikasi_m : request.is_kualifikasi_m,
            is_pembuka : request.is_pembuka,
            teks_pembuka : request.teks_pembuka
        },{transaction : t})

        if(!trxKategoriStore) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Store TrxKategori")

        for(const pelaku of request.pelaku_usaha) {
            const storeTrxKatJVendor = await TrxKatJVendor.create({
                kode_jenis_vendor : pelaku.kode_jenis_vendor,
                kode_trx_kategori : trxKategoriStore.kode_trx_kategori
            }, {transaction : t})

            if(!storeTrxKatJVendor) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Store Pada Pelaku Usaha")
        }

        const storedData : any = await TrxKategori.findOne({
            where : {
                kode_trx_kategori : trxKategoriStore.kode_trx_kategori
            },
            include : [
                {
                    model : TrxKatJVendor, 
                    as : "TrxKatJVendor",
                    include : [
                        {
                            model : JenisVendor,
                            as : "JenisVendor"
                        }
                    ]
                }
            ],
            transaction : t
        })

        if(!storedData) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Terjadi Kesalahan Pada Stored Data")
            
        
        const result = {
            kode_kategori: storedData.kode_kategori,
            keperluan: storedData.keperluan,
            kode_jenis_pengadaan: storedData.kode_jenis_pengadaan,
            is_kualifikasi_b : storedData. is_kualifikasi_b,
            is_kualifikasi_k : storedData. is_kualifikasi_k,
            is_kualifikasi_m : storedData. is_kualifikasi_m,
            is_pembuka : storedData. is_pembuka,
            teks_pembuka : storedData. teks_pembuka,
            pelaku_usaha : storedData.TrxKatJVendor.map((item : any) => {
                return {
                    kode_jenis_vendor : item.kode_jenis_vendor,
                    jenis_vendor : item.JenisVendor.jenis_vendor
                }
            })
        }


        await t.commit()

        return result
    } catch (error) {
        await t.rollback()
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            debugLogger.debug(error)
            throw new CustomError(500, responseStatus.error, "Internal server error.")
        }
    }
}

const deleteTrxKategori = async (id:ParameterSchema["params"]["id"]) => {
    const t = await db.transaction()
    try {
        const exTrxKategori = await TrxKategori.findByPk(id,
            {transaction : t}
        )

        if(!exTrxKategori) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Data Dihapus Tidak Tersedia")

        const destroyKatJVendor = await TrxKatJVendor.destroy({
            where : {
                kode_trx_kategori : id
            },
            transaction : t
        })

        if(destroyKatJVendor === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus Data")

        const destroyTrxKategori = await TrxKatJVendor.destroy({
            where : {
                kode_trx_kategori : id
            },
            transaction : t
        })

        if(destroyTrxKategori === 0) throw new CustomError(httpCode.unprocessableEntity, responseStatus.error, "Gagal Hapus TrxKategori")

        await t.commit()

        return exTrxKategori
    } catch (error) {
        await t.rollback()
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
    getListKategori,
    storeTrxKategori,
    deleteTrxKategori
}