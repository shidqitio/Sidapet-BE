import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import TrxPenjaringan from "./trxPenjaringan-model";

interface ITrxUndanganPenjrAttributes {
    kode_und_penjr : number
	kode_penjaringan : number
	nama : string | undefined | null
	email : string | undefined | null
	alamat : string | undefined | null
	nama_pic : string | undefined | null
	no_hp_wa : string | undefined | null
	token : string | undefined | null
}

export type TrxUndanganPenjrOutput = Required<ITrxUndanganPenjrAttributes>

export type TrxUndanganPenjrInput = Optional<
ITrxUndanganPenjrAttributes,
"kode_und_penjr" | 
"kode_penjaringan"
>

class TrxUndanganPenjr
    extends Model<ITrxUndanganPenjrAttributes, TrxUndanganPenjrInput>
    implements ITrxUndanganPenjrAttributes
{
    declare kode_und_penjr : number
	declare kode_penjaringan : number
	declare nama : string | undefined | null
	declare email : string | undefined | null
	declare alamat : string | undefined | null
	declare nama_pic : string | undefined | null
	declare no_hp_wa : string | undefined | null
	declare token : string | undefined | null
}

TrxUndanganPenjr.init(
	{
		kode_und_penjr : {
			type : DataTypes.STRING,
			allowNull : false,
			primaryKey : true,
			autoIncrement : true
		},
		kode_penjaringan : {
			type : DataTypes.STRING,
			allowNull : true
		},
		nama : {
			type : DataTypes.STRING,
			allowNull : true
		},
		email : {
			type : DataTypes.STRING,
			allowNull : true
		},
		alamat : {
			type : DataTypes.STRING,
			allowNull : true
		},
		nama_pic : {
			type : DataTypes.STRING,
			allowNull : true
		},
		no_hp_wa : {
			type : DataTypes.STRING,
			allowNull : true
		},
		token : {
			type : DataTypes.STRING,
			allowNull : true
		},
	},
	{
		sequelize : db,
		schema : "public",
		tableName : "trx_undangan_penjr",
		timestamps : false
	}
)

TrxUndanganPenjr.belongsTo(TrxPenjaringan, {
	foreignKey : "kode_penjaringan",
	as : "TrxPenjaringan"
})

TrxPenjaringan.hasMany(TrxUndanganPenjr,{
	foreignKey : "kode_penjaringan",
	as : "TrxUndanganPenjr"
})

export default TrxUndanganPenjr