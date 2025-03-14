import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import JenisVendor from "./jenisVendor-model";
import Vendor from "./vendor-model";

export enum StatusRegister {
    proses = "proses",
    terima = "terima",
    tolak = "tolak"
}

interface IRegisterVendorAttributes {
    kode_register      : number;
    kode_vendor        : number;
    kode_jenis_vendor  : number;
    nama_perusahaan    : string;
    email              : string | null | undefined;
    password           : string;
    no_telp            : string | null | undefined;
    swafoto            : string | null | undefined;
    status_register    : StatusRegister;
    alasan_ditolak     : string | null | undefined ;
    user_verif         : string | null | undefined;
    message            : string | null | undefined;
    similarity         : boolean | null | undefined;
    distance_percentage: number |  null | undefined;
    distance_point     : number |  null | undefined;
    keypass            : any;
    nama_narahubung    : string | null | undefined ;
    no_wa_narahubung   : string | null | undefined;   //Nomor Kantor
    udcr               : Date | undefined;
    udch               : Date | undefined;
}

export type RegisterVendorOutput = Required<IRegisterVendorAttributes>

export type RegisterVendorInput = Optional<
IRegisterVendorAttributes, 
"kode_register" |
"kode_vendor" |
"kode_jenis_vendor" |
"nama_perusahaan" |
"email" |
"password" |
"no_telp" |
"swafoto" |
"status_register" |
"alasan_ditolak" |
"user_verif" |
"message" |
"similarity" |
"distance_percentage" |
"distance_point" |
"keypass" |
"nama_narahubung" |
"no_wa_narahubung" |
"udcr" |
"udch" 
>

class RegisterVendor 
    extends Model<IRegisterVendorAttributes, RegisterVendorInput>
    implements IRegisterVendorAttributes
{
    declare kode_register      : number;
    declare kode_vendor        : number;
    declare kode_jenis_vendor  : number;
    declare nama_perusahaan    : string;
    declare email              : string | null | undefined;
    declare password           : string;
    declare no_telp    : string | null | undefined;
    declare swafoto            : string | null | undefined;
    declare status_register    : StatusRegister;
    declare alasan_ditolak     : string | null | undefined ;
    declare user_verif         : string | null | undefined;
    declare message            : string | null | undefined;
    declare similarity         : boolean | null | undefined;
    declare distance_percentage: number |  null | undefined;
    declare distance_point     : number |  null | undefined;
    declare keypass            : any;
    declare nama_narahubung    : string | null | undefined ;
    declare no_wa_narahubung         : string | null | undefined;
    declare udcr               : Date | undefined;
    declare udch               : Date | undefined;
}

RegisterVendor.init(
    {

        kode_register : {
            type : DataTypes.STRING,
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER, 
            allowNull : true
        },
        kode_jenis_vendor : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        nama_perusahaan : {
            type : DataTypes.STRING,
            allowNull : true
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        no_telp : {
            type : DataTypes.STRING,
            allowNull : true
        },
        swafoto : {
            type : DataTypes.STRING,
            allowNull : false
        },
        status_register : {
            type : DataTypes.STRING,
            allowNull : true,
            defaultValue : "proses"
        },
        alasan_ditolak : {
            type : DataTypes.STRING,
            allowNull : true
        },
        message : {
            type : DataTypes.STRING,
            allowNull : true
        },
        user_verif : {
            type : DataTypes.STRING,
            allowNull : true
        },
        similarity : {
            type : DataTypes.STRING,
            allowNull : true
        },
        distance_percentage : {
            type : DataTypes.STRING,
            allowNull : true
        },
        distance_point : {
            type : DataTypes.STRING,
            allowNull : true
        },
        keypass : {
            type : DataTypes.STRING,
            allowNull : true
        },
        nama_narahubung : {
            type : DataTypes.STRING,
            allowNull : true
        },
        no_wa_narahubung : {
            type : DataTypes.STRING,
            allowNull : true
        },
        udcr : {
            type : DataTypes.DATE,
            allowNull : true
        },
        udch : {
            type : DataTypes.DATE,
            allowNull : true
        },
    }, 
    {
        sequelize : db, 
        schema : "public",
        modelName : "VendorRegister", 
        tableName : "ref_vendor_register", 
        createdAt : "udcr", 
        updatedAt : "udch"
    }
)

RegisterVendor.belongsTo(JenisVendor, {
    foreignKey : "kode_jenis_vendor", 
    as : "JenisVendor"
})
JenisVendor.hasMany(RegisterVendor, {
    foreignKey : "kode_jenis_vendor", 
    as : "RegisVendor"
})

RegisterVendor.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasOne(RegisterVendor, {
    foreignKey : "kode_vendor",
    as : "RegisterVendor"
})

export default RegisterVendor; 



