import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface IFasilitasPerusahaanAttributes {
	kode_peralatan : number,
	kode_vendor : number,
	nm_fasilitas : string | null | undefined,
	jumlah_fasilitas : string | null | undefined,
	fasilitas_now : string | null | undefined,
	merk_fasilitas : string | null | undefined,
	tahun_fasilitas : string | null | undefined,
	kondisi_fasilitas : string | null | undefined,
	lokasi_fasilitas : string | null | undefined,
	path_fasilitas : string | null | undefined,
	custom : string | null | undefined,
}

export type  FasilitasPerusahaanOutput= Required<IFasilitasPerusahaanAttributes>

export type FasilitasPerusahaanInput = Optional<
IFasilitasPerusahaanAttributes, 
"kode_peralatan" | 
"kode_vendor" | 
"nm_fasilitas" | 
"jumlah_fasilitas" | 
"fasilitas_now" | 
"merk_fasilitas" | 
"tahun_fasilitas" | 
"kondisi_fasilitas" | 
"lokasi_fasilitas" | 
"path_fasilitas" | 
"custom" 
>

class FasilitasPerusahaan 
    extends Model<IFasilitasPerusahaanAttributes, FasilitasPerusahaanInput>
    implements IFasilitasPerusahaanAttributes
{
	declare kode_peralatan : number;
	declare kode_vendor : number;
	declare nm_fasilitas : string | null | undefined;
	declare jumlah_fasilitas : string | null | undefined;
	declare fasilitas_now : string | null | undefined;
	declare merk_fasilitas : string | null | undefined;
	declare tahun_fasilitas : string | null | undefined;
	declare kondisi_fasilitas : string | null | undefined;
	declare lokasi_fasilitas : string | null | undefined;
	declare path_fasilitas : string | null | undefined;
	declare custom : string | null | undefined;
}

FasilitasPerusahaan.init(
    {
        kode_peralatan : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        nm_fasilitas : {
            type : DataTypes.STRING,
            allowNull : true
        },
        jumlah_fasilitas : {
            type : DataTypes.STRING,
            allowNull : true
        },
        fasilitas_now : {
            type : DataTypes.STRING,
            allowNull : true
        },
        merk_fasilitas : {
            type : DataTypes.STRING,
            allowNull : true
        },
        tahun_fasilitas : {
            type : DataTypes.STRING,
            allowNull : true
        },
        kondisi_fasilitas : {
            type : DataTypes.STRING,
            allowNull : true
        },
        lokasi_fasilitas : {
            type : DataTypes.STRING,
            allowNull : true
        },
        path_fasilitas : {
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
        tableName : "ref_fasilitas_perusahaan",
        modelName : "FasilitasPerusahaan",
        timestamps : false
    }
)

FasilitasPerusahaan.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(FasilitasPerusahaan, {
    foreignKey : "kode_vendor",
    as : "FasilitasPerusahaan"
})


export default FasilitasPerusahaan