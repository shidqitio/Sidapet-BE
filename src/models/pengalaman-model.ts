import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface IPengalamanAttributes {
	kode_pengalaman_perusahaan : number 
	kode_vendor : number
	nama_pekerjaan : string | undefined | null
	tahun_pekerjaan : number | undefined
	pemberi_kerja : string | undefined | null
	nilai_pekerjaan : number | undefined | null
	jangka_waktu : string | undefined | null
	no_kontrak : string | undefined | null
	file_kontrak : string | undefined | null
    encrypt_key_kontrak : string | undefined | null
	is_kontrak_selamanya : boolean
	kontrak_berlaku_awal : Date | undefined
	kontrak_berlaku_akhir : Date | undefined
	file_bast : string | undefined | null
	is_bast_selamanya : boolean
	bast_berlaku_awal :  Date | undefined
	bast_berlaku_akhir : Date | undefined
    encrypt_key_bast : string | undefined | null
}

export type  PengalamanOutput= Required<IPengalamanAttributes>

export type PengalamanInput = Optional<
IPengalamanAttributes, 
"kode_pengalaman_perusahaan" |
"kode_vendor" |
"nama_pekerjaan" |
"tahun_pekerjaan" |
"pemberi_kerja" |
"nilai_pekerjaan" |
"jangka_waktu" |
"no_kontrak" |
"file_kontrak" |
"is_kontrak_selamanya" |
"kontrak_berlaku_awal" |
"kontrak_berlaku_akhir" |
"file_bast" |
"is_bast_selamanya" |
"bast_berlaku_awal" |
"bast_berlaku_akhir" |
"encrypt_key_kontrak" |
"encrypt_key_bast" 
>

class Pengalaman 
    extends Model<IPengalamanAttributes, PengalamanInput>
    implements IPengalamanAttributes
{
    declare kode_pengalaman_perusahaan : number ;
    declare kode_vendor : number;
    declare nama_pekerjaan : string | undefined | null;
    declare tahun_pekerjaan : number | undefined;
    declare pemberi_kerja : string | undefined | null;
    declare nilai_pekerjaan : number | undefined | null;
    declare jangka_waktu : string | undefined | null;
    declare no_kontrak : string | undefined | null;
    declare file_kontrak : string | undefined | null;
    declare is_kontrak_selamanya : boolean;
    declare kontrak_berlaku_awal : Date | undefined;
    declare kontrak_berlaku_akhir : Date | undefined;
    declare file_bast : string | undefined | null;
    declare is_bast_selamanya : boolean;
    declare bast_berlaku_awal :  Date | undefined;
    declare bast_berlaku_akhir : Date | undefined;
    declare encrypt_key_kontrak : string | undefined | null
    declare encrypt_key_bast : string | undefined | null
}

Pengalaman.init(
    {
        kode_pengalaman_perusahaan : {
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
        tahun_pekerjaan : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        pemberi_kerja : {
            type : DataTypes.STRING,
            allowNull : true
        },
        nilai_pekerjaan : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        jangka_waktu : {
            type : DataTypes.STRING,
            allowNull : true
        },
        no_kontrak : {
            type : DataTypes.STRING,
            allowNull : true
        },
        file_kontrak : {
            type : DataTypes.STRING,
            allowNull : true
        },
        encrypt_key_kontrak : {
            type : DataTypes.STRING,
            allowNull : true
        },
        is_kontrak_selamanya : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        },
        kontrak_berlaku_awal : {
            type : DataTypes.DATE,
            allowNull : true
        },
        kontrak_berlaku_akhir : {
            type : DataTypes.DATE,
            allowNull : true
        },
        file_bast : {
            type : DataTypes.STRING,
            allowNull : true
        },
        encrypt_key_bast : {
            type : DataTypes.STRING,
            allowNull : true
        },
        is_bast_selamanya : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        },
        bast_berlaku_awal : {
            type : DataTypes.DATE,
            allowNull : true
        },
        bast_berlaku_akhir : {
            type : DataTypes.DATE,
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_pengalaman_perusahaan",
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