const express = require("express");
const multer = require("multer");
const path = require("path");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { authMiddleware } = require("../middleware/auth");
const Task = require("../models/Task")
const router = express.Router();

// Upload config (PDFs only, max 3)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDFs allowed"), false);
};
const upload = multer({ storage, fileFilter, limits: { files: 3 } });

router.use(authMiddleware);

router.get("/", getTasks);
// router.get("/", async (req, res) => {
//   try {
//     const tasks = await Task.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
//     res.status(200).json(tasks);
//   } catch (err) {
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });
router.post("/", upload.array("documents", 3), createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
