import express from "express";
import { getRelationship, addRelationship, deleteRelationship } from "../controllers/relacionamentoCon.js";

const router = express.Router()

router.get("/", getRelationship)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)

export default router