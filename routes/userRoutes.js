const express = require("express");
const { getAllUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware, isAdmin); // all routes are admin-protected

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
