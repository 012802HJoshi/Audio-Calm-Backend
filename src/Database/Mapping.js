// yes, it’s optional. Sequelize doesn’t require a models/index.js. 
// What is required is that all associations are created after models are defined and before you use them (sync, queries, include, etc.).

// Why people use a central file
// Ensures associations run once and in the right order.
// Avoids circular imports (model A importing model B and vice-versa).
// Gives one place to export { sequelize, Category, Sound, ... }.



import { Category } from "../Model/model.category.js";
import { Sound } from "../Model/model.sound.js";
import { sequelize } from "./db.js";

export function setupModels(sequelize){
    Category.hasMany(Sound,{foreignKey:"cat_id"});
    Sound.belongsTo(Category,{foreignKey:"cat_id"});

    return {Category,Sound};
}
