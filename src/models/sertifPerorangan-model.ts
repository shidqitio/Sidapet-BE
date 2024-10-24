import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";




interface ISertifPeroranganAttributes {
	kode_sertif : number
	kode_vendor : number
	nm_sertif_orang : string | null | undefined,
	path_sertif : string | null | undefined,
	custom : string | null | undefined,
    encrypt_key : string | null | undefined
}

export type SertifPeroranganOutput = Required<ISertifPeroranganAttributes>

export type SertifPeroranganInput = Optional<
ISertifPeroranganAttributes, 
"kode_sertif" |
"kode_vendor" |
"encrypt_key"
>

class SertifPerorangan 
    extends Model<ISertifPeroranganAttributes, SertifPeroranganInput>
    implements ISertifPeroranganAttributes
{
    declare kode_sertif : number;
    declare kode_vendor : number;
    declare nm_sertif_orang : string | null | undefined;
    declare path_sertif : string | null | undefined;
    declare custom : string | null | undefined;
    declare encrypt_key: string | null | undefined;
    
}

SertifPerorangan.init(
    {
        kode_sertif : {
            type : DataTypes.INTEGER, 
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER, 
            allowNull : false
        },
        nm_sertif_orang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        path_sertif : {
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