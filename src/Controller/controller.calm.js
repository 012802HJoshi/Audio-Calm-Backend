import { getDurationFromBuffer } from '../Helper/getDurationFromBuffer.js';
import {Category} from '../Model/model.category.js';
import { Sound } from '../Model/model.sound.js';
import { Op } from 'sequelize';
import { gcsupload } from '../Helper/gcsupload.js';
import { gcsdelete } from '../Helper/gcsdelete.js';
import { name_maker } from '../Helper/name_maker.js';


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

export const getSound = async(req,res)=>{
   try{
    const {cat_id,tag} = req.query;

    console.log(cat_id);

    if(!cat_id && !tag){
     return res.status(401).json({
      message:'missing data'
    })
    }

    const categories = await Category.findOne({
      where:{cat_id:cat_id}
    })

      const sounds = await Sound.findAll({
        where:{
          cat_id: Array.isArray(cat_id) ? {[Op.in]:cat_id} :cat_id
        }
      });
   
    return res.status(200).json({
       message:'Fetched All Data By Category Id',
       cat_data:categories,
       data:sounds
    });

   }catch(err){
    return res.status(500).json({
       message:`Internal Server Error: ${err}`,
    });
   }
}

export const getAllCategory = async(req,res)=>{
  try{
  const categories = await Category.findAll();

   return res.status(200).json({
       message:'All Category Data Fetched',
       data:categories
    });

  }catch(err){
    return res.status(500).json({
       message:`Internal Server Error: ${err}`,
    });
  }
}

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