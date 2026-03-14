import { getDurationFromBuffer } from '../Helper/getDurationFromBuffer.js';
import {Category} from '../Model/model.category.js';
import { Sound } from '../Model/model.sound.js';
import { Op } from 'sequelize';
import { gcsupload } from '../Helper/gcsupload.js';
import { gcsdelete } from '../Helper/gcsdelete.js';
import { name_maker } from '../Helper/name_maker.js';
import redisClient from '../Redis/redisClient.js';


export const createCategory = async(req,res)=>{
  const isAudio = false;
  try{
    const {title,premium} = req.body;

    const thumbnail_img = req.files?.thumbnail_img?.[0];
    const banner_img = req.files?.banner_img?.[0];

    const cat_name = name_maker(title);

     if(!cat_name || !thumbnail_img || premium===undefined  || !banner_img){
         return res.status(401).json({
          message:'missing category data'
         })
    }

    const thumbnail_url =await gcsupload(cat_name,thumbnail_img,isAudio);
    const banner_url = await gcsupload(cat_name,banner_img,isAudio);

    const category =  await Category.create({
      title,
      cat_name,
      premium: premium,
      thumbnail_img: thumbnail_url,
      banner_img: banner_url,
    });
  
    return res.status(200).json({
       message:'category Added into the Database',
       data:category
    });
  }catch(err){
   return res.status(500).json({
       message:`Internal Server Error: ${err}`,
    });
  }
}

export const createSound = async(req,res)=>{
  const isAudio = true;
 try{
   console.log(`CREATE SOUND`);
  const {cat_id,title,premium} = req.body;

  const thumbnail_img = req.files?.thumbnail_img?.[0];
  const sound_audio = req.files?.sound_audio?.[0];

  if(!title || !thumbnail_img || premium===undefined || !sound_audio || !cat_id){
    return res.status(401).json({
      message:'missing category data'
    })
  }

  const sound_name = name_maker(title);

  const category = await Category.findByPk(cat_id);

  const durationSec = await getDurationFromBuffer(sound_audio.buffer);

  const thumbnail_url =await gcsupload(category.cat_name,thumbnail_img,isAudio,sound_name);
  const sound_audio_url = await gcsupload(category.cat_name,sound_audio,isAudio,sound_name);

  const sound = await Sound.create({
    cat_id:cat_id,
    title:title,
    sound_name:sound_name,
    premium:premium,
    sound_audio:sound_audio_url,
    thumbnail_img:thumbnail_url,
    duration:durationSec
  });

  return res.status(200).json({
       message:'Sound Added into the Database',
       data:sound
    });

 }catch(err){
   return res.status(500).json({
       message:`Internal Server Error: ${err}`,
    });
 }
}

// export const getSound = async(req,res)=>{
//    const cacheKey = "CALM:SOUNDS";

//    try{
//     const {cat_id,tag} = req.query;

//     if(!cat_id && !tag){
//      return res.status(401).json({
//       message:'missing data'
//     })
//     }

//     const categories = await Category.findOne({
//       where:{cat_id:cat_id}
//     })

//       const sounds = await Sound.findAll({
//         where:{
//           cat_id: Array.isArray(cat_id) ? {[Op.in]:cat_id} :cat_id
//         }
//       });

//       await redisClient.setEx(
//           `${cacheKey}:${cat_id}`,
//           3600, 
//           JSON.stringify({cat_data:categories,data:sounds})
//       );
   
//     return res.status(200).json({
//        message:'Fetched All Data By Category Id',
//        cat_data:categories,
//        data:sounds
//     });

//    }catch(err){
//     return res.status(500).json({
//        message:`Internal Server Error: ${err}`,
//     });
//    }
// }

// export const getAllCategory = async (req, res) => {
//     const cacheKey = "CALM:ALL_CATEGORIES";

//     try {
//         const categories = await Category.findAll();

//         await redisClient.setEx(
//             cacheKey,
//             3600, 
//             JSON.stringify(categories)
//         );

//         return res.status(200).json({
//             message: "All Category Data Fetched",
//             data: categories
//         });

//     } catch (err) {
//         return res.status(500).json({
//             message: `Internal Server Error: ${err.message}`
//         });
//     }
// };

export const getAllCategory = async (req, res) => {
  const cacheKey = "CALM:ALL_CATEGORIES";

  try {
    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const categories = await Category.findAll();

    const formattedCategories = categories.map((cat) => ({
      cat_id: String(cat.cat_id),
      cat_name: cat.title,
      thumnail_img: cat.thumbnail_img,
      premium: cat.premium ? "Y" : "N",
      count: "25",
      updated: cat.updatedAt,
      likes: "25",
      banner_image: cat.banner_img
    }));

    const response = {
      status: {
        message: "success",
        code: "200",
        code_str: "ok",
        extra_data: ""
      },
      data: formattedCategories
    };

    // Store formatted response in cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

    return res.status(200).json(response);

  } catch (err) {
    return res.status(500).json({
      status: {
        message: "Internal Server Error",
        code: "500",
        code_str: "server_error",
        extra_data: err.message
      }
    });
  }
};


export const getSound = async (req, res) => {
  try {
    const { cat_id } = req.query;

    if (!cat_id) {
      return res.status(400).json({
        status: {
          message: "missing data",
          code: "400",
          code_str: "bad_request",
          extra_data: ""
        }
      });
    }

    const cacheKey = `CALM:SOUNDS:${cat_id}`;

    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const category = await Category.findOne({ where: { cat_id } });

    if (!category) {
      return res.status(404).json({
        status: {
          message: "Category not found",
          code: "404",
          code_str: "not_found",
          extra_data: ""
        }
      });
    }

    const sounds = await Sound.findAll({ where: { cat_id } });

    const formattedSounds = sounds.map((sound) => ({
      id: String(sound.sound_id),
      title: sound.title,
      st_url: sound.sound_audio,
      thumbnail: sound.thumbnail_img,
      big_img: "NA",
      premium: sound.premium ? "Y" : "N",
      writer: category.title,
      powerdby: "NA",
      duration: sound.duration || "NA"
    }));

    const response = {
      status: {
        message: "success",
        code: "200",
        code_str: "ok",
        extra_data: ""
      },
      data: {
        Lastupdated: new Date().toISOString(),
        [category.title]: formattedSounds   // ← fixed: was category.cat_name (doesn't exist on model)
      }
    };

    // Store formatted response in cache
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

    return res.status(200).json(response);

  } catch (err) {
    return res.status(500).json({
      status: {
        message: "Internal Server Error",
        code: "500",
        code_str: "server_error",
        extra_data: err.message
      }
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { cat_id, cat_name } = req.body;

    if (!cat_id && !cat_name) {
      return res.status(400).json({ message: "missing data: provide cat_id or cat_name" });
    }

    const where = cat_id ? { cat_id } : { cat_name };
    const category = await Category.findOne({ where });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { cat_id: idToDelete, cat_name: nameToDelete } = category;
    
    const deletedCount = await Category.destroy({ where: { cat_id: idToDelete } });

    if (deletedCount === 0) {
      return res.status(500).json({ message: "Failed to delete category from DB" });
    }

    const gcsResult = await gcsdelete(nameToDelete,false);

    console.log(gcsResult);

    return res.status(200).json({
      message: `Deleted Category ${nameToDelete}`,
      data: { cat_id: idToDelete, cat_name: nameToDelete },
      storage: { deleted: gcsResult }
    });

  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({ message: `Internal Server Error`, error: String(err?.message || err) });
  }
};

export const deleteSound = async (req, res) => {
  try {
    const { cat_id, sound_id } = req.body;

    if (!cat_id || !sound_id) { 
      return res.status(400).json({ message: "missing data: provide cat_id or cat_name" });
    }


    const category = await Category.findOne({ where: { cat_id: cat_id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { cat_id: idToDelete, cat_name: nameToDelete } = category;

    const sound = await Sound.findOne({ where: { sound_id: sound_id } });

    if (!sound) {
      return res.status(404).json({ message: "Sound not found" });
    }

    const { sound_id: soundIdToDelete, sound_name: soundToDelete } = sound;

    const deletedCountSound = await Sound.destroy({ where: { sound_id: soundIdToDelete } });

    if (deletedCountSound === 0) {
      return res.status(500).json({ message: "Failed to delete category from DB" });
    }

    const gcsResult = await gcsdelete(nameToDelete,true,soundToDelete);

    // console.log(gcsResult);

    return res.status(200).json({
      message: `Deleted Category ${nameToDelete}`,
      data: { cat_id: idToDelete, cat_name: nameToDelete },
      storage: { deleted: gcsResult }
    });

  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({ message: `Internal Server Error`, error: String(err?.message || err) });
  }
};