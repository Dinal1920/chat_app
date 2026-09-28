import express from 'express'
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/signup", signup) // frontend ni request receive karse, signup function call thase
router.post("/login", login)
router.post("/logout", logout)

// frontend ni request receive karse
router.put("/update-profile", protectRoute, updateProfile)  
router.get("/check", protectRoute, checkAuth)

export default router;