import { gcpInit } from "../Helper/gcpInit.js";

export const chuncking_audio = async(req,res)=>{
    try{
       const file = gcpInit().file("test1/Test_Audio.wav");
       const [metadata] = await file.getMetadata();

    //    console.log(metadata);

        res.setHeader('Content-Disposition', `attachment; filename="Test_Audio.wav"`);
        res.setHeader('Content-Type', metadata.contentType || 'application/octet-stream');
        res.setHeader('Content-Length', metadata.size);

         const range = req.headers.range;
        if (!range) {
            res.status(416).send('Range header missing');
            return;
        }

        const { size } = metadata;

        const start = parseInt(range.replace(/\D/g, ''), 10);  // Extract the start byte from the range
        const end = Math.min(start + 1024 * 1024 - 1, size - 1); // 1MB chunk size (you can adjust this)
        const chunkSize = end - start + 1;

        res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
        res.setHeader('Accept-Ranges', 'bytes');
        res.status(206);

        file.createReadStream()
            .on('error', (err) => {
                    console.error('Error streaming from GCS:', err);
                    res.status(500).send('Error streaming file');
                })
            .on('data',(chunk)=>{
                res.write(chunk);
            })
            .on('end',()=>{
                res.end();
            })
    }catch(error){
        console.error('Error retrieving file from GCS:', error);
            if (error.code === 404) {
                res.status(404).send('File not found in GCS.');
            } else {
                res.status(500).send('Server error retrieving file.');
            }
    }
}