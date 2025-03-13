import db from "@config/database"
import { DataTypes, Optional, Model } from "sequelize"


interface IKepemilikanAttributes {
    kode_kepemilikan : number | undefined | null
    kepemilikan : string | undefined | null
}

export type KepemilikanOutput = Required<IKepemilikanAttributes>

export type KepemilikanInput = Optional<
IKepemilikanAttributes,
"kode_kepemilikan" | 
"kepemilikan"
>

class Kepemilikan
    extends Model<IKepemilikanAttributes, KepemilikanInput>
    implements IKepemilikanAttributes
{
    declare kode_kepemilikan : number | undefined | null
    declare kepemilikan : string | undefined | null
}

Kepemilikan.init(
    {
        kode_kepemilikan : {
            type : DataTypes.INTEGER(),
            allowNull : false,
            primaryKey : true,
            autoIncrement : true 
        },
        kepemilikan : {
            type : DataTypes.STRING(),
            allowNull : true 
        },
    },
    {
        sequelize : db,
        schema : "public",
        tableName : "ref_kepemilikan",
        modelName : "Kepemilikan",
        timestamps : false
    }
)

export default Kepemilikan