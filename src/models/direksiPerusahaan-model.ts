import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface IDireksiPerusahaanAttributes {
	kode_direksi_perus : number,
	kode_vendor : number,
	nm_direksi : string | undefined | null,
	jbtn_direksi : string | undefined | null,
	hp_direksi : string | undefined | null,
	no_ktp_direksi : string | undefined | null,
	path_ktp_direksi : string | undefined | null,
    is_ktp_selamanya : boolean,
    ktp_berlaku_awal : Date | undefined,
    ktp_berlaku_akhir : Date | undefined,
	custom : string | undefined | null,
    encrypt_key : string | undefined | null
}

export type  DireksiPerusahaanOutput= Required<IDireksiPerusahaanAttributes>

export type DireksiPerusahaanInput = Optional<
IDireksiPerusahaanAttributes, 
"kode_direksi_perus" |
"kode_vendor" |
"nm_direksi" |
"jbtn_direksi" |
"hp_direksi" |
"no_ktp_direksi" |
"path_ktp_direksi" |
"is_ktp_selamanya" |
"ktp_berlaku_akhir"|
"ktp_berlaku_awal" |
"custom" |
"encrypt_key"
>

class DireksiPerusahaan 
    extends Model<IDireksiPerusahaanAttributes, DireksiPerusahaanInput>
    implements IDireksiPerusahaanAttributes
{
	declare kode_direksi_perus : number ;
	declare kode_vendor : number ;
	declare nm_direksi : string | undefined | null ;
	declare jbtn_direksi : string | undefined | null ;
	declare hp_direksi : string | undefined | null ;
	declare no_ktp_direksi : string | undefined | null ;
	declare path_ktp_direksi : string | undefined | null ;
    declare is_ktp_selamanya : boolean;
    declare ktp_berlaku_awal : Date | undefined;
    declare ktp_berlaku_akhir : Date | undefined;
	declare custom : string | undefined | null ;
    declare encrypt_key: string | null | undefined; 
}

DireksiPerusahaan.init(
    {
        kode_direksi_perus : {
            type : DataTypes.INTEGER, 
            allowNull : false,
            primaryKey : true, 
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER, 
            allowNull : false
        },
        nm_direksi : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        jbtn_direksi : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        hp_direksi : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        no_ktp_direksi : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        path_ktp_direksi : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        is_ktp_selamanya : {
            type : DataTypes.BOOLEAN(),
            defaultValue : true,
        },
        ktp_berlaku_awal : {
            type : DataTypes.DATE(),
            allowNull : true
        },
        ktp_berlaku_akhir : {
            type : DataTypes.DATE(),
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
        tableName : "ref_direksi_perusahaan",
        modelName : "DireksiPerusahaan",
        timestamps : false
    }
)

DireksiPerusahaan.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(DireksiPerusahaan, {
    foreignKey : "kode_vendor",
    as : "DireksiPerusahaan"
})


export default DireksiPerusahaan