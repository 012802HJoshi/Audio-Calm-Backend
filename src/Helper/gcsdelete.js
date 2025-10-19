import { gcpInit } from "./gcpInit.js";

export const gcsdelete = async(cat_name,isAudio,sound_name)=>{
     try{
        const bucket = gcpInit();
        let prefix; 
            if(isAudio){
            prefix =`${cat_name}/${sound_name}/`;
            }else{
             prefix =`${cat_name}/`;
            }

            const [files] = await bucket.getFiles({ prefix });
            console.log("About to delete", files.map(f => f.name));

            console.log(prefix);
            const file =bucket.deleteFiles({ prefix, force: true });
            
            console.log(`GCS LOG FOR DELETING FOLDER:${file}`);
            return file;
    }catch(err){
        console.log(err);
        new Error(err);
    }
}