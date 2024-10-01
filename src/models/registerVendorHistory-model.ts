import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import JenisVendor from "./jenisVendor-model";

export enum StatusRegister {
    proses = "proses",
    terima = "terima",
    tolak = "tolak"
}

interface IRegisterVendorHistoryAttributes {
    kode_register      : number;
    kode_vendor        : number;
    kode_jenis_vendor  : number;
    nama_perusahaan    : string;
    email              : string | null | undefined;
    password           : string;
    nomor_handphone    : string | null | undefined;
    swafoto            : string | null | undefined;
    status_register    : StatusRegister;
    alasan_ditolak     : string | null | undefined ;
    user_verif         : string | null | undefined;
    message            : string | null | undefined;
    similarity         : boolean | null | undefined;
    distance_percentage: number |  null | undefined;
    distance_point     : number |  null | undefined;
    keypass            : any;
    udcr               : Date | undefined;
    udch               : Date | undefined;
}

export type RegisterVendorHistoryOutput = Required<IRegisterVendorHistoryAttributes>

export type RegisterVendorHistoryInput = Optional<
IRegisterVendorHistoryAttributes, 
"kode_jenis_vendor" 
|"kode_register"
|"kode_vendor"
| "user_verif" 
| "similarity" 
| "distance_percentage" 
| "distance_point"
| "keypass" 
| "alasan_ditolak"
| "udch" 
| "udcr"
| "swafoto"
| "message"
| "udcr"
| "udch"
>

class RegisterVendorHistory
    extends Model<IRegisterVendorHistoryAttributes, RegisterVendorHistoryInput>
    implements IRegisterVendorHistoryAttributes
{
    declare kode_register      : number;
    declare kode_vendor        : number;
    declare kode_jenis_vendor  : number;
    declare nama_perusahaan    : string;
    declare email              : string | null | undefined;
    declare password           : string;
    declare nomor_handphone    : string;
    declare swafoto            : string | null | undefined;
    declare status_register       : StatusRegister;
    declare alasan_ditolak     : string | null | undefined ;
    declare message: string | null | undefined; 
    declare user_verif         : string | null | undefined;
    declare similarity         : boolean | null | undefined;
    declare distance_percentage: number |  null | undefined;
    declare distance_point     : number |  null | undefined;
    declare keypass            : any;
    declare udcr               : Date | undefined;
    declare udch               : Date | undefined;
}

RegisterVendorHistory.init(
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
        nomor_handphone : {
            type : DataTypes.STRING,
            allowNull : true
        },
        swafoto : {
            type : DataTypes.STRING,
            allowNull : false
        },
        status_register : {
            type : DataTypes.STRING,
            allowNull : true
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
        modelName : "VendorRegisterHistory", 
        tableName : "ref_vendor_reg_history", 
        createdAt : "udcr", 
        updatedAt : "udch"
    }
)

RegisterVendorHistory.belongsTo(JenisVendor, {
    foreignKey : "kode_jenis_vendor", 
    as : "JenisVendor"
})
JenisVendor.hasMany(RegisterVendorHistory, {
    foreignKey : "kode_jenis_vendor", 
    as : "RegisVendorHistory"
})


export default RegisterVendorHistory; 



