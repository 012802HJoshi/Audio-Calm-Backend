import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import status from "express-status-monitor";

const app = express();

app.use(status());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config({
    path:`./.env.${process.env.NODE_ENV || 'development'}`
});

import "./Database/initDatabase.js";

import { router as calmapi } from "./Router/route.calm.js";
import {router as chunk} from "./Router/route.chunck.js";

const port = process.env.PORT;

app.use('/calm', calmapi);
app.use("/chunck",chunk);

app.get("/", (req, res) => {
  return res.status(200).send("Hello Calm Sleep Server developed and CI/CDed by Harshit Joshi !!!");
});


app.listen(port, () => {
  console.log(`[Server]: Server FiredUp at ${port}`);
});
