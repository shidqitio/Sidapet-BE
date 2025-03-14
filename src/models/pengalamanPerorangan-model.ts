import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";


interface IPengalamanPeroranganAttributes {
	kode_pengalaman_perorangan : number
	kode_vendor : number
	nama_pekerjaan : string | undefined | null
	posisi : string | undefined | null
	jangka_waktu : string | undefined | null
    nilai_pekerjaan : number | undefined | null
    file_bukti :string | undefined | null
    encrypt_key :string | undefined | null
    custom : string | undefined | null
}

export type PengalamanPeroranganOutput = Required<IPengalamanPeroranganAttributes>

export type PengalamanPeroranganInput = Optional<
IPengalamanPeroranganAttributes, 
"kode_pengalaman_perorangan" |
"kode_vendor" |
"nama_pekerjaan" |
"posisi" |
"jangka_waktu" |
"nilai_pekerjaan" |
"file_bukti" |
"encrypt_key" |
"custom" 
>

class PengalamanPerorangan 
    extends Model<PengalamanPeroranganOutput, PengalamanPeroranganInput>
    implements PengalamanPeroranganOutput
{
	declare kode_pengalaman_perorangan : number
	declare kode_vendor : number
	declare nama_pekerjaan : string | undefined | null
	declare posisi : string | undefined | null
	declare jangka_waktu : string | undefined | null
    declare nilai_pekerjaan : number | undefined | null
    declare file_bukti :string | undefined | null
    declare encrypt_key :string | undefined | null
    declare custom : string | undefined | null
    
}

PengalamanPerorangan.init(
    {
        kode_pengalaman_perorangan : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        nama_pekerjaan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        posisi : {
            type : DataTypes.STRING,
            allowNull : true
        },
        jangka_waktu : {
            type : DataTypes.STRING,
            allowNull : true
        },
        nilai_pekerjaan : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        file_bukti : {
            type : DataTypes.STRING,
            allowNull : true
        },
        encrypt_key : {
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
        tableName : "ref_pengalaman_perorangan",
        modelName : "PengalamanPerorangan",
        timestamps : false
    }
)

PengalamanPerorangan.belongsTo(Vendor, {
    foreignKey : "kode_vendor", 
    as : "Vendor"
})

Vendor.hasMany(PengalamanPerorangan, {
    foreignKey : "kode_vendor",
    as : "PengalamanPerorangan"
})




export default PengalamanPerorangan