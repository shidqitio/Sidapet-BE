import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface ISertifPeroranganAttributes {
	kode_sertif_perorangan : number
	kode_vendor : number | undefined | null
	nm_sertifikat : string | undefined | null
	file_bukti : string | undefined | null
	encrypt_key : string | undefined | null
	custom : string | undefined | null
}

export type  SertifPeroranganOutput= Required<ISertifPeroranganAttributes>

export type SertifPeroranganInput = Optional<
ISertifPeroranganAttributes, 
"kode_sertif_perorangan" |
"kode_vendor" |
"nm_sertifikat" |
"file_bukti" |
"encrypt_key" |
"custom" 
>

class SertifPerorangan 
    extends Model<ISertifPeroranganAttributes, SertifPeroranganInput>
    implements ISertifPeroranganAttributes
{
    declare kode_sertif_perorangan : number
    declare kode_vendor : number | undefined | null
    declare nm_sertifikat : string | undefined | null
    declare file_bukti : string | undefined | null
    declare encrypt_key : string | undefined | null
    declare custom : string | undefined | null
}

SertifPerorangan.init(
    {
        kode_sertif_perorangan : {
            type : DataTypes.INTEGER ,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.STRING,
            allowNull : true
        },
        nm_sertifikat : {
            type : DataTypes.STRING,
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
        tableName : "ref_sertif_perorangan",
        modelName : "SertifPerorangan",
        timestamps : false
    }
)

SertifPerorangan.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(SertifPerorangan, {
    foreignKey : "kode_vendor",
    as : "SertifPerorangan"
})


export default SertifPerorangan