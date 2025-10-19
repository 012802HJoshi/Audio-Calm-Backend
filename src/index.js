import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import status from "express-status-monitor";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();

app.use(status());
// app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config({
    path:`./.env.${process.env.NODE_ENV || 'development'}`
});

import "./Database/initDatabase.js";

import { router as calmapi } from "./Router/route.calm.js";
import { router as chuck } from "./Router/route.chuck.js";

const port = process.env.PORT;

app.use('/calm', calmapi);
app.use('/chunkup',chuck);

app.get("/", (req, res) => {
  return res.status(200).send("Hello Calm Sleep Server developed and CI/CDed by Harshit Joshi !!!");
});


// app.get("/download", (req, res) => {
//   const filePath = path.join(__dirname, "/public/audio.wav");

//   fs.readFile(filePath, "utf8", (err, data) => {
//     if (err) return res.status(404).send("File not found");
//     res.send(data);
//   });

// });

// app.get("/chucked-download", (req, res) => {
//   const filePath = path.join(__dirname, "/public/audio.wav");

//   const stream = fs.createReadStream(filePath);

//   stream.on("data", (chunk) => {
//     res.write(chunk);
//   });

//   stream.on("end", () => {
//     res.end();
//   });

//   stream.on("error", (err) => {
//     console.error("Error reading file:", err);
//     res.status(500).send("Internal Server Error");
//   });
// });


app.listen(port, () => {
  console.log(`[Server]: Server FiredUp at ${port}`);
});
