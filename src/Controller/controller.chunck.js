import { gcpInit } from "../Helper/gcpInit.js";

export const chuncking_audio = async(req,res)=>{
    try{
       const file = gcpInit().file("test1/Test_Audio.wav");
       const [metadata] = await file.getMetadata();

        res.setHeader('Content-Disposition', `attachment; filename="Test_Audio.wav"`);
        res.setHeader('Content-Type', metadata.contentType || 'application/octet-stream');
        res.setHeader('Content-Length', metadata.size);

        file.createReadStream()
            .on('error', (err) => {
                    console.error('Error streaming from GCS:', err);
                    res.status(500).send('Error streaming file');
                })
            .pipe(res);
    }catch(error){
        console.error('Error retrieving file from GCS:', error);
            if (error.code === 404) {
                res.status(404).send('File not found in GCS.');
            } else {
                res.status(500).send('Server error retrieving file.');
            }
    }
}