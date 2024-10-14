import db from "@config/database";
import { DataTypes, Optional, Model } from "sequelize";
import KatDokumenVendor from "./katDokumenVendor-model";



interface IkatItemTanya {
	kode_kat_item_tanya : number;
	kode_kat_dokumen_vendor : number;
	urutan : number;
	kategori_item : string;
}

export type KatItemTanyaOutput = Required<IkatItemTanya>

export type KatItemTanyaInput = Optional<
IkatItemTanya, 
"kode_kat_item_tanya"|
"kategori_item"|
"kode_kat_dokumen_vendor"|
"urutan"
>

class KatItemTanya 
    extends Model<IkatItemTanya, KatItemTanyaInput>
    implements IkatItemTanya
{
    declare kode_kat_item_tanya : number;
    declare kode_kat_dokumen_vendor : number;
    declare urutan : number;
    declare kategori_item : string;
}

KatItemTanya.init(
    {
        kode_kat_item_tanya : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey : true, 
            autoIncrement : true
        },
        kode_kat_dokumen_vendor : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        urutan : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        kategori_item : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
    },
    {
        sequelize : db, 
        schema : "public",
        tableName : "ref_kat_item_tanya",
        modelName : "KatItemTanya",
        timestamps : false
    }
)

KatItemTanya.belongsTo(KatDokumenVendor, {
    foreignKey : "kode_kat_dokumen_vendor",
    as : "KatDokVendor"
})

KatDokumenVendor.hasMany(KatItemTanya, {
    foreignKey : "kode_kat_dokumen_vendor",
    as : "KatItemTanya"
})


export default KatItemTanya