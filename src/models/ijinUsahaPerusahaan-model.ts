import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface IIjinUsahaPerusahaanAttributes {
 kode_ijin_usaha  : number,
 kode_vendor      : number,
 nama_izin        : string | undefined | null,
 no_izin          : string | undefined | null,
 masa_izin        : string | undefined | null,
 pemberi_izin     : string | undefined | null,
 kualifikasi_usaha: string | undefined | null,
 klasifikasi_usaha: string | undefined | null,
 tdp              : string | undefined | null,
 path_izin        : string | undefined | null,
 custom           : string | undefined | null,
 encrypt_key      : string | undefined | null
}

export type  IjinUsahaPerusahaanOutput= Required<IIjinUsahaPerusahaanAttributes>

export type IjinUsahaPerusahaanInput = Optional<
IIjinUsahaPerusahaanAttributes, 
"kode_ijin_usaha" |
"kode_vendor" |
"nama_izin" |
"no_izin" |
"masa_izin" |
"pemberi_izin" |
"kualifikasi_usaha" |
"klasifikasi_usaha" |
"tdp" |
"path_izin" |
"custom" | 
"encrypt_key"
>

class IjinUsahaPerusahaan 
    extends Model<IIjinUsahaPerusahaanAttributes, IjinUsahaPerusahaanInput>
    implements IIjinUsahaPerusahaanAttributes
{
 declare kode_ijin_usaha  : number ;
 declare kode_vendor      : number ;
 declare nama_izin        : string | undefined | null ;
 declare no_izin          : string | undefined | null ;
 declare masa_izin        : string | undefined | null ;
 declare pemberi_izin     : string | undefined | null ;
 declare kualifikasi_usaha: string | undefined | null ;
 declare klasifikasi_usaha: string | undefined | null ;
 declare tdp              : string | undefined | null ;
 declare path_izin        : string | undefined | null ;
 declare custom           : string | undefined | null ;
 declare encrypt_key      : string | null | undefined;
}

IjinUsahaPerusahaan.init(
    {
        kode_ijin_usaha : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        nama_izin : {
            type : DataTypes.STRING,
            allowNull : true
        },
        no_izin : {
            type : DataTypes.STRING,
            allowNull : true
        },
        masa_izin : {
            type : DataTypes.STRING,
            allowNull : true
        },
        pemberi_izin : {
            type : DataTypes.STRING,
            allowNull : true
        },
        kualifikasi_usaha : {
            type : DataTypes.STRING,
            allowNull : true
        },
        klasifikasi_usaha : {
            type : DataTypes.STRING,
            allowNull : true
        },
        tdp : {
            type : DataTypes.STRING,
            allowNull : true
        },
        path_izin : {
            type : DataTypes.STRING,
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
        tableName : "ref_ijin_usaha_perusahaan",
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