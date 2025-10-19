import { gcpInit } from "./gcpInit.js";

export const gcsupload = async(cat_name,filename,isAudio,sound_name)=>{
    try{
        const bucket = gcpInit();
        let directory; 
             if(isAudio){
             directory =`${cat_name}/${sound_name}/${filename.originalname}`;
            }else{
             directory =`${cat_name}/${filename.originalname}`;
            }
            const file =bucket.file(directory);
    
            const response = await new Promise((resolve,reject)=>{
              const writeStream = file.createWriteStream({
                metadata:{
                  contentType:filename.mimetype
                }
              })
              writeStream.on("error",reject);
              writeStream.on("finish",resolve);
              writeStream.end(filename.buffer);
            });
    
            return `https://storage.googleapis.com/calm_sleep/${directory}`;
    }catch(err){
        console.log(err);
        new Error(err);
    }
    }