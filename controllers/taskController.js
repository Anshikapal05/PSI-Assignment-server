const Task = require("../models/Task");


exports.getTasks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    let query = {};
    let tasksQuery;

    if (req.user.role === "admin") {
      // Admin: fetch all tasks
      tasksQuery = Task.find().populate("assignedTo", "name email");
    } else {
      // Regular user: only their tasks
      query = { assignedTo: req.user._id };
      tasksQuery = Task.find(query);
    }

    const totalTasks = await Task.countDocuments(req.user.role === "admin" ? {} : { assignedTo: req.user._id });

    const tasks = await tasksQuery
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      tasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: Number(page),
      totalTasks,
    });

  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};


// exports.createTask = async (req, res) => {
//   const { title, description, status, priority, dueDate, assignedTo } = req.body;
//   const files = req.files?.map(file => file.path) || [];

//   try {
//     const task = new Task({ title, description, status, priority, dueDate, assignedTo, attachedDocuments: files });
//     await task.save();
//     res.status(201).json(task);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const files = req.files ? req.files.map((f) => f.path) : [];

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      attachedDocuments: files,
      assignedTo: req.user._id, // Make sure your auth middleware attaches req.user
    });

    await newTask.save();
    res.status(201).json({ message: "Task created", task: newTask });
  }  catch (err) {
  console.error("Task creation failed:", err.message); // 👈 this gives actual error
  res.status(500).json({ message: "Internal Server Error", error: err.message }); // helpful for Postman debug
}

};

exports.updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
