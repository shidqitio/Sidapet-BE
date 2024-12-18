import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Kategori from "./kategori-model";

export enum status_pengajuan_kat {
    draft = "draft",
    diproses_verifikator = "diproses_verifikator",
    diproses_kasubdit = "diproses_kasubdit",
    selesai = "selesai"
}

interface ITrxKategoriAttributes {
	kode_trx_kategori   : number
	kode_kategori       : number | null
	kode_cabang_ut      : number | null
	keperluan           : string | undefined | null
	kode_jenis_pengadaan: number | null
	is_kualifikasi_k    : boolean
	is_kualifikasi_m    : boolean
	is_kualifikasi_b    : boolean
	is_pembuka          : boolean
	teks_pembuka        : string | undefined | null
	status_pengajuan_kat: status_pengajuan_kat
	ucr                 : string | undefined | null
	uch                 : string | undefined | null
	udch                : Date | undefined
	udcr                : Date | undefined
}

export type TrxKategoriOutput = Required<ITrxKategoriAttributes>

export type TrxKategoriInput = Optional<
ITrxKategoriAttributes,
"kode_trx_kategori" |
"kode_kategori" |
"kode_cabang_ut" |
"keperluan" |
"kode_jenis_pengadaan" |
"is_kualifikasi_k" |
"is_kualifikasi_m" |
"is_kualifikasi_b" |
"is_pembuka" |
"teks_pembuka" |
"status_pengajuan_kat" |
"ucr" |
"uch" |
"udch" |
"udcr"
>

class TrxKategori 
    extends Model<ITrxKategoriAttributes, TrxKategoriInput>
    implements ITrxKategoriAttributes
    {
        declare kode_trx_kategori   : number ;
        declare kode_kategori       : number | null ;
        declare kode_cabang_ut      : number | null ;
        declare keperluan           : string | undefined | null ;
        declare kode_jenis_pengadaan: number | null ;
        declare is_kualifikasi_k    : boolean ;
        declare is_kualifikasi_m    : boolean ;
        declare is_kualifikasi_b    : boolean ;
        declare is_pembuka          : boolean ;
        declare teks_pembuka        : string | undefined | null ;
        declare status_pengajuan_kat: status_pengajuan_kat ;
        declare ucr                 : string | undefined | null ;
        declare uch                 : string | undefined | null ;
        declare udch                : Date | undefined ;
        declare udcr                : Date | undefined ;
    }

TrxKategori.init( 
    {
        kode_trx_kategori : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_kategori : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        kode_cabang_ut : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        keperluan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        kode_jenis_pengadaan : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        is_kualifikasi_k : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        },
        is_kualifikasi_m : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        },
        is_kualifikasi_b : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        },
        is_pembuka : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        },
        teks_pembuka : {
            type : DataTypes.STRING,
            allowNull : true
        },
        status_pengajuan_kat : {
            type : DataTypes.ENUM("draft", "diproses_verifikator", "diproses_kasubdit", "selesai"),
            allowNull : true,
            defaultValue : "draft"
        },
        ucr : {
            type : DataTypes.STRING,
            allowNull : true
        },
        uch : {
            type : DataTypes.STRING,
            allowNull : true
        },
        udch : {
            type : DataTypes.DATE,
            allowNull : true
        },
        udcr : {
            type : DataTypes.DATE,
            allowNull : true
        },
    },
    {
        sequelize : db,
        schema : "public",
        tableName : "trx_kategori",
        modelName : "TrxKategori",
        createdAt : "udcr",
        updatedAt : "udch"
    }
)

TrxKategori.belongsTo(Kategori, {
    foreignKey : "kode_kategori",
    as : "Kategori"
})

Kategori.hasMany(TrxKategori, {
    foreignKey : "kode_kategori",
    as : "TrxKategori"
})


export default TrxKategori