import { Router } from "express";
import { chuncking_audio } from "../Controller/controller.chunck.js";

export const router =Router();

router.get("/audio",chuncking_audio);