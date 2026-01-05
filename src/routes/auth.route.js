import { Router } from "express";
import { signIn, signOut, signUp, checkAuth } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/checkauth", protectRoute, checkAuth);

export default router;
