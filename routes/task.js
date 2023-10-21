const express = require("express");
const router = express.Router();
const taskController = require("../controller/task");

// To use the functions:
router.post("/createTask", taskController.insertTask);
router.put("/updateTask", taskController.updateTask);
router.post("/getTask", taskController.getTasks);
router.put("/updateStatus", taskController.updateTask);
router.put("/updateTaskall/:id", taskController.updateTaskall);
router.delete("/deleteTask/:id", taskController.deleteTask);

module.exports=router