import { gcpInit } from "../Helper/gcpInit.js";
import mime from "mime-types";

export const streaming_audio = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "Missing file URL parameter" });
    }

    const bucket = gcpInit();
    const file = bucket.file(url);


    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ error: "File not found" });
    }

    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType || mime.lookup(url) || "application/octet-stream";
    const size = parseInt(metadata.size, 10);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", size);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Accept-Ranges", "none");


    const readStream = file.createReadStream();



    readStream.on("data", (chunk) => {
      const ok = res.write(chunk);
      // console.log(`Streaming started for: ${url}`);
      if (!ok) {
        readStream.pause();
        res.once("drain", () => readStream.resume());
      }
    });

    readStream.on("end", () => {
      res.end();
      console.log(`Streaming completed for: ${url}`);
    });

    readStream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error streaming file" });
      } else {
        res.destroy(err);
      }
    });

    req.on("close", () => {
      if (res.writableEnded) return;
      console.log(`Client disconnected during stream: ${url}`);
      readStream.destroy();
    });

  } catch (error) {
    console.error("Error retrieving file from GCS:", error);
    if (!res.headersSent) {
      if (error.code === 404) {
        res.status(404).json({ error: "File not found in GCS" });
      } else {
        res.status(500).json({ error: "Server error retrieving file" });
      }
    }
  }
};
