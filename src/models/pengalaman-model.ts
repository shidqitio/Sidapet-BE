import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface IPengalamanAttributes {
	kode_pengalaman : number,
	kode_vendor : number,
	nm_pnglmn : string | undefined | null,
	div_pnglmn : string | undefined | null,
	ringkas_pnglmn : string | undefined | null,
	lok_pnglmn : string | undefined | null,
	pemberi_pnglmn : string | undefined | null,
	alamat_pnglmn : string | undefined | null,
	tgl_pnglmn : string | undefined | null,
	nilai_pnglmn : string | undefined | null,
	status_pnglmn : string | undefined | null,
	tgl_selesai_pnglmn : string | undefined | null,
	ba_pnglmn : string | undefined | null,
	path_pnglmn : string | undefined | null,
	custom : string | undefined | null,
}

export type  PengalamanOutput= Required<IPengalamanAttributes>

export type PengalamanInput = Optional<
IPengalamanAttributes, 
"kode_pengalaman" |
"kode_vendor" |
"nm_pnglmn" |
"div_pnglmn" |
"ringkas_pnglmn" |
"lok_pnglmn" |
"pemberi_pnglmn" |
"alamat_pnglmn" |
"tgl_pnglmn" |
"nilai_pnglmn" |
"status_pnglmn" |
"tgl_selesai_pnglmn" |
"ba_pnglmn" |
"path_pnglmn" |
"custom" 
>

class Pengalaman 
    extends Model<IPengalamanAttributes, PengalamanInput>
    implements IPengalamanAttributes
{
	declare kode_pengalaman : number;
	declare kode_vendor : number;
	declare nm_pnglmn : string | undefined | null;
	declare div_pnglmn : string | undefined | null;
	declare ringkas_pnglmn : string | undefined | null;
	declare lok_pnglmn : string | undefined | null;
	declare pemberi_pnglmn : string | undefined | null;
	declare alamat_pnglmn : string | undefined | null;
	declare tgl_pnglmn : string | undefined | null;
	declare nilai_pnglmn : string | undefined | null;
	declare status_pnglmn : string | undefined | null;
	declare tgl_selesai_pnglmn : string | undefined | null;
	declare ba_pnglmn : string | undefined | null;
	declare path_pnglmn : string | undefined | null;
	declare custom : string | undefined | null;
}

Pengalaman.init(
    {
        kode_pengalaman : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        nm_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        div_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        ringkas_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        lok_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        pemberi_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        alamat_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        tgl_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        nilai_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        status_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        tgl_selesai_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        ba_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        path_pnglmn : {
            type : DataTypes.STRING,
            allowNull : true
        },
        custom : {
            type : DataTypes.STRING,
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_pengalaman",
        modelName : "Pengalaman",
        timestamps : false
    }
)

Pengalaman.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(Pengalaman, {
    foreignKey : "kode_vendor",
    as : "Pengalaman"
})


export default Pengalaman