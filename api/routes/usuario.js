import express from 'express';
import { getUser, updateUser } from '../controllers/usuarioCon.js';

const router = express.Router()

router.get("/find/:usuarioId", getUser)
router.put("/", updateUser)

export default router