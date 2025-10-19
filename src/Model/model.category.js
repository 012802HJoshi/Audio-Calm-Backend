import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const Category = sequelize.define("Category",{
    cat_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        index: true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    cat_name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    thumbnail_img:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    premium:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    banner_img:{
        type:DataTypes.STRING,
    }
},{
    tableName:"categories",
    timestamps:true,
});
