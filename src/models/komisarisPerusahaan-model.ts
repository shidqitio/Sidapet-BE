import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface IKomisarisPerusahaanAttributes {
	kode_komisaris : number,
	kode_vendor : number | undefined,
	nm_komisaris : string | null | undefined,
	jbtn_komisaris : string | null | undefined,
	hp_komisaris : string | null | undefined,
	no_ktp_komisaris : string | null | undefined,
	path_ktp_komisaris : string | null | undefined,
    is_ktp_selamanya : boolean,
    ktp_berlaku_awal : Date | undefined,
    ktp_berlaku_akhir : Date | undefined,
	custom : string | null | undefined,
    encrypt_key : string | null | undefined
}

export type  KomisarisPerusahaanOutput= Required<IKomisarisPerusahaanAttributes>

export type KomisarisPerusahaanInput = Optional<
IKomisarisPerusahaanAttributes, 
"kode_komisaris" | 
"kode_vendor" |
"nm_komisaris"|
"jbtn_komisaris"|
"hp_komisaris"|
"no_ktp_komisaris"|
"path_ktp_komisaris"|
"is_ktp_selamanya" | 
"ktp_berlaku_awal" | 
"ktp_berlaku_akhir" | 
"custom" | 
"encrypt_key"
>

class KomisarisPerusahaan 
    extends Model<IKomisarisPerusahaanAttributes, KomisarisPerusahaanInput>
    implements IKomisarisPerusahaanAttributes
{
	declare kode_komisaris : number;
	declare kode_vendor : number | undefined;
	declare nm_komisaris : string | null | undefined;
	declare jbtn_komisaris : string | null | undefined;
	declare hp_komisaris : string | null | undefined;
	declare no_ktp_komisaris : string | null | undefined;
	declare path_ktp_komisaris : string | null | undefined;
    declare is_ktp_selamanya : boolean;
    declare ktp_berlaku_awal : Date | undefined;
    declare ktp_berlaku_akhir : Date | undefined;
	declare custom : string | null | undefined;
    declare encrypt_key: string | null | undefined;
}

KomisarisPerusahaan.init(
    {
        kode_komisaris : {
            type : DataTypes.INTEGER, 
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.STRING, 
            allowNull : false
        },
        nm_komisaris : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        jbtn_komisaris : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        hp_komisaris : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        no_ktp_komisaris : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        path_ktp_komisaris : {
            type : DataTypes.STRING, 
            allowNull : true
        },
        is_ktp_selamanya : {
            type : DataTypes.BOOLEAN,
            allowNull : false
        }, 
        ktp_berlaku_awal : {
            type : DataTypes.DATE,
            allowNull : true
        },
        ktp_berlaku_akhir : {
            type : DataTypes.DATE,
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
        tableName : "ref_komisaris_perusahaan",
        modelName : "KomisarisPerusahaan",
        timestamps : false
    }
)

KomisarisPerusahaan.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(KomisarisPerusahaan, {
    foreignKey : "kode_vendor",
    as : "KomisarisPerusahaan"
})


export default KomisarisPerusahaan