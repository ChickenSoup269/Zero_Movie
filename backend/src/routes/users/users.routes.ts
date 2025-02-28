import express from "express";
import {
  getUserProfileController,
  updateUserProfileController,
} from "../../controllers/users/users.controller";

const router = express.Router();

router.get("/me", getUserProfileController);
router.put("/me", updateUserProfileController);

export default router;
