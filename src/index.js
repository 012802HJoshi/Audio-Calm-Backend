import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config({
    path:`./.env.${process.env.NODE_ENV || 'development'}`
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

import "./Database/initDatabase.js";

import { router as calmapi } from "./Router/route.calm.js";
import {router as chunk} from "./Router/route.chunck.js";

const port = process.env.PORT;

// Public static assets
app.use("/img", express.static(path.join(projectRoot, "img")));

// Public JSON
app.get("/calms/calm/calm_master.json", (req, res) => {
  return res.sendFile(path.join(projectRoot, "calm_master.json"));
});

app.use('/calm', calmapi);
app.use("/chunk",chunk);

app.get("/", (req, res) => {
  return res.status(200).send("Hello Calm Sleep Server developed and CI/CDed by Harshit Joshi !!!");
});

app.listen(port, () => {
  console.log(`[Server]: Server FiredUp at ${port}`);
});