import express from "express";
import upload from "../middleware/multer.js";
import {
   createWork,
   getAllWorks,
   getWorkBySlug,
   updateWork,
   deleteWork,
} from "../controller/work.controller.js";

const router = express.Router();

/* ===============================
   PUBLIC ROUTES
================================ */

router.get("/", getAllWorks);
router.get("/:slug", getWorkBySlug);

/* ===============================
   ADMIN ROUTES
================================ */

// CREATE WORK (with images)
router.post(
   "/",
   upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "galleryImages", maxCount: 5 },
   ]),
   createWork
);

// UPDATE WORK (optional image update)
router.put(
   "/:id",
   upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "galleryImages", maxCount: 5 },
   ]),
   updateWork
);

// DELETE WORK
router.delete("/:id", deleteWork);

export default router;
