import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import JenisVendor from "./jenisVendor-model";




interface IKatDokumenVendor {
	kode_kat_dokumen_vendor: number;
	kode_jenis_vendor      : number;
	urutan                 : number;
	is_main                : boolean;
	is_has_sub             : boolean;
	main_kat               : number;
	nama_kategori          : string;
    show_on_syarat_pdf : boolean
}

export type KatDokumenVendorOutput = Required<IKatDokumenVendor>

export type KatDokumenVendorInput = Optional<
IKatDokumenVendor, 
"kode_kat_dokumen_vendor"|
"is_main"|
"is_has_sub"|
"kode_jenis_vendor"|
"main_kat"|
"nama_kategori"|
"urutan" | 
"show_on_syarat_pdf"
>

class KatDokumenVendor 
    extends Model<IKatDokumenVendor, KatDokumenVendorInput>
    implements IKatDokumenVendor
    {
        declare kode_kat_dokumen_vendor: number;
        declare kode_jenis_vendor      : number;
        declare urutan                 : number;
        declare is_main                : boolean;
        declare is_has_sub             : boolean;
        declare main_kat               : number;
        declare nama_kategori          : string;
        declare show_on_syarat_pdf     : boolean;
    }

KatDokumenVendor.init(
    {
        kode_kat_dokumen_vendor : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true  
        },
        kode_jenis_vendor : {
            type : DataTypes.INTEGER,
            allowNull : true,  
        },
        urutan : {
            type : DataTypes.INTEGER,
            allowNull : true,  
        },
        is_main : {
            type : DataTypes.INTEGER,
            allowNull : true,  
        },
        is_has_sub : {
            type : DataTypes.INTEGER,
            allowNull : true,  
        },
        main_kat : {
            type : DataTypes.INTEGER,
            allowNull : true,  
        },
        nama_kategori : {
            type : DataTypes.INTEGER,
            allowNull : true,  
        },
        show_on_syarat_pdf : {
            type : DataTypes.BOOLEAN(),
            defaultValue : false
        }
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_kat_dokumen_vendor",
        modelName : "KatDokumenVendor",
        timestamps : false
    }
)

KatDokumenVendor.belongsTo(JenisVendor, {
    foreignKey : "kode_jenis_vendor",
    as : "JenisVendor"
})

JenisVendor.hasMany(KatDokumenVendor, {
    foreignKey : "kode_jenis_vendor",
    as : "KatDokVendor"
})

export default KatDokumenVendor