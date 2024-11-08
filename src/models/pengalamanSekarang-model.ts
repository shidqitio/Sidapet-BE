import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface IPengalamanSekarangAttributes {
	kode_pengalaman_sekarang : number,
	kode_vendor : number,
	nm_pnglmn_sekarang : string | undefined | null,
	div_pnglmn_sekarang : string | undefined | null,
	ringkas_pnglmn_sekarang : string | undefined | null,
	lok_pnglmn_sekarang : string | undefined | null,
	pemberi_pnglmn_sekarang : string | undefined | null,
	alamat_pnglmn_sekarang : string | undefined | null,
	tgl_pnglmn_sekarang : string | undefined | null,
	nilai_pnglmn_sekarang : string | undefined | null,
	status_pnglmn_sekarang : string | undefined | null,
	kontrak_pnglmn_sekarang : string | undefined | null,
	prestasi_pnglmn_sekarang : string | undefined | null,
	path_pnglmn_skrg : string | undefined | null,
	custom : string | undefined | null,
    encrypt_key : string | undefined | null
}

export type  PengalamanSekarangOutput= Required<IPengalamanSekarangAttributes>

export type PengalamanSekarangInput = Optional<
IPengalamanSekarangAttributes, 
"kode_pengalaman_sekarang" |
"kode_vendor" |
"nm_pnglmn_sekarang" |
"div_pnglmn_sekarang" |
"ringkas_pnglmn_sekarang" |
"lok_pnglmn_sekarang" |
"pemberi_pnglmn_sekarang" |
"alamat_pnglmn_sekarang" |
"tgl_pnglmn_sekarang" |
"nilai_pnglmn_sekarang" |
"status_pnglmn_sekarang" |
"kontrak_pnglmn_sekarang" |
"prestasi_pnglmn_sekarang" |
"path_pnglmn_skrg" |
"custom"  |
"encrypt_key"
>

class PengalamanSekarang 
    extends Model<IPengalamanSekarangAttributes, PengalamanSekarangInput>
    implements IPengalamanSekarangAttributes
{
	declare kode_pengalaman_sekarang : number;
	declare kode_vendor : number;
	declare nm_pnglmn_sekarang : string | undefined | null;
	declare div_pnglmn_sekarang : string | undefined | null;
	declare ringkas_pnglmn_sekarang : string | undefined | null;
	declare lok_pnglmn_sekarang : string | undefined | null;
	declare pemberi_pnglmn_sekarang : string | undefined | null;
	declare alamat_pnglmn_sekarang : string | undefined | null;
	declare tgl_pnglmn_sekarang : string | undefined | null;
	declare nilai_pnglmn_sekarang : string | undefined | null;
	declare status_pnglmn_sekarang : string | undefined | null;
	declare kontrak_pnglmn_sekarang : string | undefined | null;
	declare prestasi_pnglmn_sekarang : string | undefined | null;
	declare path_pnglmn_skrg : string | undefined | null;
	declare custom : string | undefined | null;
    declare encrypt_key: string | null | undefined;
}

PengalamanSekarang.init(
    {
        kode_pengalaman_sekarang : {
            type : DataTypes.INTEGER, 
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER, 
            allowNull : true
        },
        nm_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        div_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        ringkas_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        lok_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        pemberi_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        alamat_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        tgl_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        nilai_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        status_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        kontrak_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        prestasi_pnglmn_sekarang : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        path_pnglmn_skrg : {
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
        tableName : "ref_pengalaman_sekarang",
        modelName : "PengalamanSekarang",
        timestamps : false
    }
)

PengalamanSekarang.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(PengalamanSekarang, {
    foreignKey : "kode_vendor",
    as : "PengalamanSekarang"
})


export default PengalamanSekarang