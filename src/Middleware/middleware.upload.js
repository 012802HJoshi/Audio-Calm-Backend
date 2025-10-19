import multer from "multer";
import path from "path";

export const uploadAssets= (files,{exts,maxKB })=>{
    return (req, res, next) => {

       const fileFilter =(req,file,cb)=>{
       const extname = exts.test(path.extname(file.originalname).toLowerCase());

       if(extname){
        return cb(null,true);
       } else {
          return cb(`Error: Invalid file type! Allowed types`);
       }
    };
    
    const upload = multer({
        storage:multer.memoryStorage(),
        fileFilter,
        limits:{fileSize:maxKB * 1024}
    });
    
    if (!req.is('multipart/form-data')) {
    return res.status(415).json({
      message: 'Content-Type must be multipart/form-data',
      got: req.headers['content-type'] || null,
    });
    }

    const fields = files.map((file)=>{
        return {name:file, maxCount: 1 }
    })
    console.log('[uploadAssets:start]', req.method, req.originalUrl, 'fields:', fields);
    upload.fields(fields)(req, res, (err) => {
      if (err) {
        console.error('[uploadAssets:error]', err);
        return next(err);
      }
      console.log(
        '[uploadAssets:done]',
        'files:', Object.keys(req.files || {}),
        'bodyKeys:', Object.keys(req.body || {})
      );
      next();
    });
  };
}