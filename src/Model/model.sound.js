import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const Sound = sequelize.define("Sound",{
    cat_id:{
     type:DataTypes.INTEGER,
     allowNull:false,
     references:{model:"categories",key:"cat_id"},
     onUpdate:"CASCADE",
     onDelete:"CASCADE"
    },
    sound_id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    sound_name:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    title:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    thumbnail_img:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    premium:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
    },
    sound_audio:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    duration:{ 
        type:DataTypes.STRING,
    },
     tag: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    }
},{
    tableName:"sounds",
    timestamps:true,
})