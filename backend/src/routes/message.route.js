import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import {
  getMessages,
  getUsersforSidebar,
  sendMessage,
  deleteMessage,
  toggleLikeMessage,
  getUnreadMessages,
  markMessagesAsRead
} from '../controllers/message.controller.js'

const router = express.Router()

// Sidebar users
router.get("/users", protectRoute, getUsersforSidebar)

//  Unread messages count (MOVE THIS UP)
router.get("/unread", protectRoute, getUnreadMessages)

// Send message
router.post("/send/:id", protectRoute, sendMessage)

// Like / Unlike
router.put("/like/:messageId", protectRoute, toggleLikeMessage)

// Mark as read
router.put("/mark/:senderId", protectRoute, markMessagesAsRead)

// Get messages between users (KEEP THIS LAST)
router.get("/:id", protectRoute, getMessages)

// Delete message
router.delete("/:id", protectRoute, deleteMessage)

export default router