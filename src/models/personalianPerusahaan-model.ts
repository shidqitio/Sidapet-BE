import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import Vendor from "./vendor-model";



interface IPersonaliaPerusahaanAttributes {
	kode_personalia : number,
	kode_vendor : number,
	nm_personal : string | undefined | null,
	tgl_personal : string | undefined | null,
	pendidikan_personal : string | undefined | null,
	jbtn_personal : string | undefined | null,
	pengalaman_personal : string | undefined | null,
	keahlian_personal : string | undefined | null,
	sertif_personal : string | undefined | null,
	path_personal : string | undefined | null,
	custom : string | undefined | null,
}

export type  PersonaliaPerusahaanOutput= Required<IPersonaliaPerusahaanAttributes>

export type PersonaliaPerusahaanInput = Optional<
IPersonaliaPerusahaanAttributes, 
"kode_personalia" |
"kode_vendor" |
"nm_personal" |
"tgl_personal" |
"pendidikan_personal" |
"jbtn_personal" |
"pengalaman_personal" |
"keahlian_personal" |
"sertif_personal" |
"path_personal" |
"custom" 
>

class PersonaliaPerusahaan 
    extends Model<IPersonaliaPerusahaanAttributes, PersonaliaPerusahaanInput>
    implements IPersonaliaPerusahaanAttributes
{
	declare kode_personalia : number;
	declare kode_vendor : number;
	declare nm_personal : string | undefined | null;
	declare tgl_personal : string | undefined | null;
	declare pendidikan_personal : string | undefined | null;
	declare jbtn_personal : string | undefined | null;
	declare pengalaman_personal : string | undefined | null;
	declare keahlian_personal : string | undefined | null;
	declare sertif_personal : string | undefined | null;
	declare path_personal : string | undefined | null;
	declare custom : string | undefined | null;
}

PersonaliaPerusahaan.init(
    {
        kode_personalia : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true
        },
        kode_vendor : {
            type : DataTypes.INTEGER(),
            allowNull : false
        },
        nm_personal : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        tgl_personal : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        pendidikan_personal : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        jbtn_personal : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        pengalaman_personal : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        keahlian_personal : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        sertif_personal : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        path_personal : {
            type : DataTypes.STRING(),
            allowNull : true
        },
        custom : {
            type : DataTypes.STRING(),
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_personalia_perusahaan",
        modelName : "PersonaliaPerusahaan",
        timestamps : false
    }
)

PersonaliaPerusahaan.belongsTo(Vendor, {
    foreignKey : "kode_vendor",
    as : "Vendor"
})

Vendor.hasMany(PersonaliaPerusahaan, {
    foreignKey : "kode_vendor",
    as : "PersonaliaPerusahaan"
})


export default PersonaliaPerusahaan