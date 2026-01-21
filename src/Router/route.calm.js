import { Router } from "express";
import { uploadAssets } from "../Middleware/middleware.upload.js";
import { createSound,createCategory,getSound, getAllCategory, deleteCategory,deleteSound} from "../Controller/controller.calm.js";
import {IMGCONSTANTS,AUDIOCONSTANTS} from "../Constants/constant.js";
import checkCache from "../Middleware/cacheMiddleware.redis.js";
export const router = Router();

router.post(
  "/create-sound",
  uploadAssets(["sound_audio","thumbnail_img"],{
    exts:AUDIOCONSTANTS.EXTSAUDIO,
    maxKB:AUDIOCONSTANTS.MAXKBAUDIO,
  }),
  createSound
);

router.post(
  "/create-sound-cat",
  uploadAssets(["thumbnail_img", "banner_img"], {
    exts:IMGCONSTANTS.EXTSIMG,
    maxKB: IMGCONSTANTS.MAXKBIMG,
  }),
  createCategory
);

router.get("/get-category",checkCache("CALM:SOUNDS"),getSound);
router.get("/get-all-category",checkCache("CALM:ALL_CATEGORIES"),getAllCategory);

router.delete("/delete-cat",deleteCategory);
router.delete("/delete-sound",deleteSound);

// router.patch("/update-category",updateCategory);
// router.patch("/update-sound",updateSound)