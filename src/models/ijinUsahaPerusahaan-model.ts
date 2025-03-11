import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";

export enum jenis_izin_usaha {
    nib = "nib",
    sbu = "sbu"
}


interface IIjinUsahaPerusahaanAttributes {
 kode_izin_usaha   : number,
 kode_vendor       : number,
 nama              : string | undefined | null,
 jenis_izin_usaha  : jenis_izin_usaha
 nomor_izin        : string | undefined | null,
 kode              : string | undefined | null,
 judul             : string | undefined | null,
 file_izin         : string | undefined | null,
 is_izin_selamanya : boolean,
 izin_berlaku_awal : Date | undefined,
 izin_berlaku_akhir: Date | undefined,
 custom            : string | undefined | null,
 encrypt_key       : string | undefined | null
}

export type  IjinUsahaPerusahaanOutput= Required<IIjinUsahaPerusahaanAttributes>

export type IjinUsahaPerusahaanInput = Optional<
IIjinUsahaPerusahaanAttributes, 
"kode_izin_usaha" |
"kode_vendor" |
"nama" |
"jenis_izin_usaha" |
"nomor_izin" |
"kode" |
"judul" |
"file_izin" |
"is_izin_selamanya" |
"izin_berlaku_awal" |
"izin_berlaku_akhir" |
"custom" |
"encrypt_key" 
>

class IjinUsahaPerusahaan 
    extends Model<IIjinUsahaPerusahaanAttributes, IjinUsahaPerusahaanInput>
    implements IIjinUsahaPerusahaanAttributes
{
    declare kode_izin_usaha   : number
    declare kode_vendor       : number
    declare nama              : string | undefined | null
    declare jenis_izin_usaha  : jenis_izin_usaha
    declare nomor_izin        : string | undefined | null
    declare kode              : string | undefined | null
    declare judul             : string | undefined | null
    declare file_izin         : string | undefined | null
    declare is_izin_selamanya : boolean
    declare izin_berlaku_awal : Date | undefined
    declare izin_berlaku_akhir: Date | undefined
    declare custom            : string | undefined | null
    declare encrypt_key       : string | undefined | null
}

IjinUsahaPerusahaan.init(
    {
        kode_izin_usaha : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        nama : {
            type : DataTypes.STRING,
            allowNull : true
        },
        jenis_izin_usaha : {
            type : DataTypes.ENUM("NIB","SBU"),
            allowNull : false
        },
        nomor_izin : {
            type : DataTypes.STRING,
            allowNull : true
        },
        kode : {
            type : DataTypes.STRING,
            allowNull : true
        },
        judul : {
            type : DataTypes.STRING,
            allowNull : true
        },
        file_izin : {
            type : DataTypes.STRING,
            allowNull : true
        },
        is_izin_selamanya : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : true
        },
        izin_berlaku_awal : {
            type : DataTypes.DATE,
            allowNull : true
        },
        izin_berlaku_akhir : {
            type : DataTypes.DATE,
            allowNull : true
        },
        custom : {
            type : DataTypes.STRING,
            allowNull : true
        },
        encrypt_key : {
            type : DataTypes.STRING,
            allowNull : true
        }
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_izin_usaha",
        modelName : "IjinUsahaPerusahaan",
        timestamps : false
    }
)

IjinUsahaPerusahaan.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(IjinUsahaPerusahaan, {
    foreignKey : "kode_vendor",
    as : "IjinUsahaPerusahaan"
})


export default IjinUsahaPerusahaan