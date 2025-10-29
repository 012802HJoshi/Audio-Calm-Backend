import { gcpInit } from "../Helper/gcpInit.js";
import fs from "node:fs";
import zlib, { gzip } from "node:zlib";

export const chuncking_audio = async (req, res) => {
  try {
    const file = gcpInit().file("test1/viral dog.jpeg");
    const [metadata] = await file.getMetadata();
    const { size, contentType, name } = metadata;

    // res.setHeader(
    //   "Content-Disposition",
    //   `inline; filename="${name?.split("/").pop() || "file"}"`
    // );
    // res.setHeader("Content-Type", contentType || "application/octet-stream");
    // res.setHeader("Accept-Ranges", "bytes");

    // const rangeHeader = req.headers.range;

    // // --- 1️⃣ No range -> send whole file
    // if (!rangeHeader) {
    //   res.setHeader("Content-Length", size);
    //   const stream = file.createReadStream();
    //   stream.on("error", (err) => {
    //     console.error("Stream error:", err);
    //     res.status(500).end("Error streaming file");
    //   });
    //   return stream.pipe(res);
    // }

    // // --- 2️⃣ Range request -> parse range
    // const matches = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    // if (!matches) {
    //   res.status(416).end("Invalid Range header");
    //   return;
    // }

    // const start = parseInt(matches[1], 10);
    // const end = matches[2] ? parseInt(matches[2], 10) : Math.min(start + 1024 * 1024 - 1, size - 1);

    // if (start >= size || end >= size) {
    //   res.status(416).end(`Requested range not satisfiable`);
    //   return;
    // }

    // const chunkSize = end - start + 1;

    // res.status(206); // Partial Content
    // res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
    // res.setHeader("Content-Length", chunkSize);

    // const stream = file.createReadStream({ start, end });
    // stream.on("error", (err) => {
    //   console.error("Stream error:", err);
    //   res.status(500).end("Error streaming file");
    // });
    // stream.pipe(res);

  
    // Streams
    const readableStream = fs.createReadStream("./file.txt",{
        encoding:"utf-8",
        highWaterMark:2 //data in chucks of 
    })
    
    const writableStream = fs.createWriteStream("./file2.txt");

    readableStream.on("data",(chunck)=>{
        //the default buffer size in streams is 64 KB
      console.log(chunck);
      writableStream.write(chunck);
    })


    // Pipes

    readableStream.pipe(writableStream);

    const gzip = zlib.createGzip();

    readableStream.pipe(gzip).pipe(fs.WriteStream("./file2.txt.gz"))

  } catch (error) {
    console.error("Error retrieving file from GCS:", error);
    if (error.code === 404) {
      res.status(404).end("File not found in GCS.");
    } else {
      res.status(500).end("Server error retrieving file.");
    }
  }
};
