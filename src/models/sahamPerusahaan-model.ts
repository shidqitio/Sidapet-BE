import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface ISahamPerusahaanAttributes {
	kode_saham : number,
	kode_vendor : number,
	nm_saham : string | undefined | null,
	no_ktp_saham : string | undefined | null,
	alamat_saham : string | undefined | null,
	persentase_saham : string | undefined | null,
	path_saham : string | undefined | null,
    is_saham_selamanya : boolean,
    saham_berlaku_awal : Date | undefined,
    saham_berlaku_akhir : Date | undefined,
	custom : string | undefined | null,
    encrypt_key : string | undefined | null
}

export type  SahamPerusahaanOutput= Required<ISahamPerusahaanAttributes>

export type SahamPerusahaanInput = Optional<
ISahamPerusahaanAttributes, 
"kode_saham" |
"kode_vendor" |
"nm_saham" |
"no_ktp_saham" |
"alamat_saham" |
"persentase_saham" |
"path_saham" |
"is_saham_selamanya" |
"saham_berlaku_awal" |
"saham_berlaku_akhir" |
"custom" | 
"encrypt_key"
>

class SahamPerusahaan 
    extends Model<ISahamPerusahaanAttributes, SahamPerusahaanInput>
    implements ISahamPerusahaanAttributes
{
    declare kode_saham : number ;
    declare kode_vendor : number ;
    declare nm_saham : string | undefined | null ;
    declare no_ktp_saham : string | undefined | null ;
    declare alamat_saham : string | undefined | null ;
    declare persentase_saham : string | undefined | null ;
    declare path_saham : string | undefined | null ;
    declare custom : string | undefined | null ;
    declare encrypt_key: string | null | undefined;
    declare is_saham_selamanya : boolean
    declare saham_berlaku_awal : Date | undefined
    declare saham_berlaku_akhir : Date | undefined
}

SahamPerusahaan.init(
    {
        kode_saham : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        nm_saham : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        no_ktp_saham : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        alamat_saham : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        persentase_saham : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        is_saham_selamanya : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        }, 
        saham_berlaku_awal : {
            type : DataTypes.DATE,
            allowNull : true
        },
        saham_berlaku_akhir : {
            type : DataTypes.DATE,
            allowNull : true
        },
        path_saham : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        custom : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        encrypt_key : {
            type : DataTypes.STRING,
            allowNull : true
        }
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_saham_perusahaan",
        modelName : "SahamPerusahaan",
        timestamps : false
    }
)

SahamPerusahaan.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(SahamPerusahaan, {
    foreignKey : "kode_vendor",
    as : "SahamPerusahaan"
})


export default SahamPerusahaan