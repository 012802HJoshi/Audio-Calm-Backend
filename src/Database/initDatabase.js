import { sequelize } from "./db.js";
import { setupModels } from "./Mapping.js";

async function initDatabase(){
    try{
    await sequelize.authenticate();
    
    console.log("✅ Connection established.");

    const models = setupModels(sequelize);
    
     if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
    } else {
      await sequelize.sync(); 
    }

    console.log("✅ Database synced.");
    
    }catch(error){
     console.error("❌ DB init failed:", error);
     process.exit(1);
    }
}

initDatabase();


