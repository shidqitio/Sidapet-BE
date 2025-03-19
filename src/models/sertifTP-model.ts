import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import TenagaAhli from "./tenagaAhli-model";
import TenagaPendukung from "./tenagaPendukung-model";

interface ISertifTPAttributes {
	kode_sertif_tp : number 
	kode_tenaga_pendukung : number | undefined | null
	sertifikat : string | undefined | null
	file_bukti : string | undefined | null
	encrypt_key : string | undefined | null
}

export type  SertifTPOutput= Required<ISertifTPAttributes>

export type SertifTPInput = Optional<
ISertifTPAttributes, 
"kode_sertif_tp" |
"kode_tenaga_pendukung" |
"sertifikat" |
"file_bukti" |
"encrypt_key" 
>

class SertifTP 
    extends Model<ISertifTPAttributes, SertifTPInput>
    implements ISertifTPAttributes
{
	declare kode_sertif_tp : number 
	declare kode_tenaga_pendukung : number | undefined | null
	declare sertifikat : string | undefined | null
	declare file_bukti : string | undefined | null
	declare encrypt_key : string | undefined | null
}

SertifTP.init(
    {
        kode_sertif_tp : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true, 
            autoIncrement : true
        },
        kode_tenaga_pendukung : {
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
        tableName : "ref_sertif_tp",
        modelName : "SertifTP",
        timestamps : false
    }
)

SertifTP.belongsTo(TenagaPendukung, {
    foreignKey : "kode_tenaga_pendukung",
    as : "TenagaPendukung"
})

TenagaPendukung.hasMany(SertifTP, {
    foreignKey : "kode_tenaga_pendukung",
    as : "SertifTP"
})


export default SertifTP