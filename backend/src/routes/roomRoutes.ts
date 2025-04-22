import { Router } from "express"
import { RoomController } from "../controllers/roomController"

const router = Router()

router.post("/", RoomController.createRoom)
router.get("/", RoomController.getAllRooms)
router.get("/cinema/:cinemaId", RoomController.getRoomsByCinemaId)
router.get("/:id", RoomController.getRoomById)
router.put("/:id", RoomController.updateRoom)
router.delete("/:id", RoomController.deleteRoom)

export default router
