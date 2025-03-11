import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface ITenagaPendukungAttributes {
	kode_tenaga_pendukung : number
	kode_vendor : number | undefined | null
	nama : string | undefined | null
	no_ktp : string | undefined | null
	file_ktp : string | undefined | null
	is_ktp_selamanya : boolean
	ktp_berlaku_awal : Date | undefined | null
	ktp_berlaku_akhir : Date | undefined | null
  encrypt_key_ktp : string | undefined | null
	tempat_lahir : string | undefined | null
	tgl_lahir : Date | undefined | null
	posisi : string | undefined | null
	kode_jenjang_pendidikan : number | undefined | null
	program_studi : string | undefined | null
	file_ijazah : string | undefined | null
	is_ijazah_selamanya : boolean | undefined | null
	ijazah_berlaku_awal : Date | undefined | null
	ijazah_berlaku_akhir : Date | undefined | null
    encrypt_key_ijazah : string | undefined | null
	file_cv : string | undefined | null
	is_cv_selamanya : boolean | undefined | null
	cv_berlaku_awal : Date | undefined | null
	cv_berlaku_akhir : Date | undefined | null
	encrypt_key_cv : string | undefined | null
	custom : string | undefined | null
}

export type  TenagaPendukungOutput= Required<ITenagaPendukungAttributes>

export type TenagaPendukungInput = Optional<
ITenagaPendukungAttributes, 
"kode_tenaga_pendukung" | 
"kode_vendor" | 
"nama" | 
"no_ktp" | 
"file_ktp" | 
"is_ktp_selamanya" | 
"ktp_berlaku_awal" | 
"ktp_berlaku_akhir" | 
"encrypt_key_ktp" | 
"tempat_lahir" | 
"tgl_lahir" | 
"posisi" | 
"kode_jenjang_pendidikan" | 
"program_studi" | 
"file_ijazah" | 
"is_ijazah_selamanya" | 
"ijazah_berlaku_awal" | 
"ijazah_berlaku_akhir" | 
"encrypt_key_ijazah" | 
"file_cv" | 
"is_cv_selamanya" | 
"cv_berlaku_awal" | 
"cv_berlaku_akhir" | 
"encrypt_key_cv" | 
"custom"
>

class TenagaPendukung 
    extends Model<ITenagaPendukungAttributes, TenagaPendukungInput>
    implements ITenagaPendukungAttributes
{
	declare kode_tenaga_pendukung : number
	declare kode_vendor : number | undefined | null
	declare nama : string | undefined | null
	declare no_ktp : string | undefined | null
	declare file_ktp : string | undefined | null
	declare is_ktp_selamanya : boolean
	declare ktp_berlaku_awal : Date | undefined | null
	declare ktp_berlaku_akhir : Date | undefined | null
  declare encrypt_key_ktp : string | undefined | null
	declare tempat_lahir : string | undefined | null
	declare tgl_lahir : Date | undefined | null
	declare posisi : string | undefined | null
	declare kode_jenjang_pendidikan : number | undefined | null
	declare program_studi : string | undefined | null
	declare file_ijazah : string | undefined | null
	declare is_ijazah_selamanya : boolean | undefined | null
	declare ijazah_berlaku_awal : Date | undefined | null
	declare ijazah_berlaku_akhir : Date | undefined | null
  declare encrypt_key_ijazah : string | undefined | null
	declare file_cv : string | undefined | null
	declare is_cv_selamanya : boolean | undefined | null
	declare cv_berlaku_awal : Date | undefined | null
	declare cv_berlaku_akhir : Date | undefined | null
	declare encrypt_key_cv : string | undefined | null
	declare custom : string | undefined | null
}

TenagaPendukung.init(
    {
        kode_tenaga_pendukung : {
          type : DataTypes.INTEGER,
          allowNull : false,
          primaryKey : true,
          autoIncrement : true  
        },
        kode_vendor : {
          type : DataTypes.INTEGER,
          allowNull : true  
        },
        nama : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        no_ktp : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        file_ktp : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        is_ktp_selamanya : {
          type : DataTypes.BOOLEAN,
          allowNull : true  
        },
        ktp_berlaku_awal : {
          type : DataTypes.DATE,
          allowNull : true  
        },
        ktp_berlaku_akhir : {
          type : DataTypes.DATE,
          allowNull : true  
        },
        encrypt_key_ktp : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        tempat_lahir : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        tgl_lahir : {
          type : DataTypes.DATE,
          allowNull : true  
        },
        posisi : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        kode_jenjang_pendidikan : {
          type : DataTypes.INTEGER,
          allowNull : true  
        },
        program_studi : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        file_ijazah : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        is_ijazah_selamanya : {
          type : DataTypes.BOOLEAN,
          allowNull : true  
        },
        ijazah_berlaku_awal : {
          type : DataTypes.DATE,
          allowNull : true  
        },
        ijazah_berlaku_akhir : {
          type : DataTypes.DATE,
          allowNull : true  
        },
        encrypt_key_ijazah : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        file_cv : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        is_cv_selamanya : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        cv_berlaku_awal : {
          type : DataTypes.DATE,
          allowNull : true  
        },
        cv_berlaku_akhir : {
          type : DataTypes.DATE,
          allowNull : true  
        },
        encrypt_key_cv : {
          type : DataTypes.STRING,
          allowNull : true  
        },
        custom : {
          type : DataTypes.JSONB,
          allowNull : true  
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_tenaga_pendukung",
        modelName : "TenagaPendukung",
        timestamps : false
    }
)

TenagaPendukung.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(TenagaPendukung, {
    foreignKey : "kode_vendor",
    as : "TenagaPendukung"
})


export default TenagaPendukung