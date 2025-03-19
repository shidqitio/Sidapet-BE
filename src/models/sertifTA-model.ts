import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import TenagaAhli from "./tenagaAhli-model";

interface ISertifTAAttributes {
	kode_sertif_ta : number 
	kode_tenaga_ahli : number | undefined | null
	sertifikat : string | undefined | null
	file_bukti : string | undefined | null
	encrypt_key : string | undefined | null
}

export type  SertifTAOutput= Required<ISertifTAAttributes>

export type SertifTAInput = Optional<
ISertifTAAttributes, 
"kode_sertif_ta" |
"kode_tenaga_ahli" |
"sertifikat" |
"file_bukti" |
"encrypt_key" 
>

class SertifTA 
    extends Model<ISertifTAAttributes, SertifTAInput>
    implements ISertifTAAttributes
{
	declare kode_sertif_ta : number 
	declare kode_tenaga_ahli : number | undefined | null
	declare sertifikat : string | undefined | null
	declare file_bukti : string | undefined | null
	declare encrypt_key : string | undefined | null
}

SertifTA.init(
    {
        kode_sertif_ta : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true, 
            autoIncrement : true
        },
        kode_tenaga_ahli : {
            type : DataTypes.STRING,
            allowNull : true
        },
        sertifikat : {
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
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_sertif_ta",
        modelName : "SertifTA",
        timestamps : false
    }
)

SertifTA.belongsTo(TenagaAhli, {
    foreignKey : "kode_tenaga_ahli",
    as : "TenagaAhli"
})

TenagaAhli.hasMany(SertifTA, {
    foreignKey : "kode_tenaga_ahli",
    as : "SertifTA"
})


export default SertifTA