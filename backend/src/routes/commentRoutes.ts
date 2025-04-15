import { Router } from "express"
import { CommentController } from "../controllers/commentController"
import { authMiddleware } from "../middlewares/auth"

const router = Router()

router.post("/", authMiddleware, CommentController.addComment)

router.get("/:movieId", CommentController.getComments)

router.put("/:commentId", authMiddleware, CommentController.updateComment)

router.delete("/:commentId", authMiddleware, CommentController.deleteComment)

export default router
