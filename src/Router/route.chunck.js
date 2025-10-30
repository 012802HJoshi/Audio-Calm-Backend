import { Router } from "express";
import { streaming_audio } from "../Controller/controller.chunck.js";

export const router =Router();

router.get("/audio",streaming_audio);