const express = require("express");
const Task = require("../models/Task");
const { default: mongoose } = require("mongoose");
const user = require("../models/user");

const insertTask = async (req, res) => {
  try {
      const { userId, title, subTitle, dateTime, scheduleType, dayOfMonth, dayOfWeek, selectedDateText } = req.body;
     
      if (!title || !subTitle) {
          res.status(400).json({
              status: false,
              message: "Title and subTitle are required."
          });
      }

      const newTask = await Task.create({
          title,
          subTitle,
          dateTime,
          scheduleType,
          dayOfMonth,
          dayOfWeek,
          selectedDateText,
          user: userId,
          status: [{ date: dateTime, done: false }] // Add initial status for the current date.
      });

      if (!newTask) {
          return res.status(400).json({
              status: false,
              message: "Not successfully added to the database."
          });
      }
console.log("suceesfully inserted")
      return res.status(200).json({
          status: true,
          message: "Task added successfully."
      });
  } catch (error) {
    console.log(`${error}`)
      return res.status(500).json({
          status: false,
          message: `Error inserting task: ${error.message}`
      });
  }
};







const updateTask = async (req, res) => {
  try {
    const id = req.body.id; // Get the _id from the request parameters
    const  date= new Date(req.body.date); // Extract the new 'done' status and 'date' from the request body
    const done=req.body.status
      
      if (!id || !date || done === undefined) {
          return res.status(400).json({
              status: false,
              message: "Task ID, date, and done status are required."
          });
      }
      

      const task = await Task.findById(id);
      
      if (!task) {
          return res.status(404).json({
              status: false,
              message: "Task not found."
          });
      }
      
      // Find the status object for the specified date and update its 'done' property.
      const statusObject = task.status.find(status =>{ 
        console.log("om",status?.date?.toISOString()?.split('T')[0],date?.toISOString()?.split('T')[0])
        return status?.date?.toISOString()?.split('T')[0] === date.toISOString()?.split('T')[0]});
        // console.log("om",statusObject)
        if(!statusObject){
          task.status.push({ date:date, done:true });
          console.log("push sucess")
          await task.save();
          console.log(task)
          return res.status(200).json({
            status: true,
            message: "Task status updated successfully."
        });
        }
      if (statusObject) {
          statusObject.done = done;
          await task.save();

          return res.status(200).json({
              status: true,
              message: "Task status updated successfully."
          });
      } else {
          return res.status(404).json({
              status: false,
              message: "Status for the specified date not found."
          });
      }
  } catch (error) {
      return res.status(500).json({
          status: false,
          message: `Error updating task status: ${error.message}`
      });
  }
};




const deleteTask = async (req, res) => {
  try {
      const { id } = req.params;
      console.log("Sucess", req.params);
      if (!id) {
      return res.status(400).json({
        status: false,
        message: "Task ID is required",
      });
    }

    // Delete the task with the specified ID
      const task = await Task.deleteOne({ _id: id });

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error deleting task: ${error.message}`,
    });
  }
};



const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const getTasks = async (req, res) => {
  try {
    const { userId, date1 } = req.body;
    const date = new Date(date1);

    const dayVarible = weekday[date.getDay()]

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    // const formattedDate = date.toLocaleDateString().replace(/\//g,'-'); 
    // const formattedDate = date.toISOString().split('T')[0]; 
    // date.setHours(date.getHours() + 24);
    // const formattedDate1 = date.toISOString().split('T')[0];

    const tasks = await Task.find({
      user: userId,
        dateTime: {
            $lte: Date(date.toISOString()),
      },
      $or:[
        {
          scheduleType: 'daily',
        },
        {
          scheduleType: 'weekly',
          dayOfWeek: dayVarible,
        },
      ]
      
    });
      console.log("tasks:",tasks);

    let statusObject=[] ;
    let myTask=[]
    
    var again=false
    await tasks.forEach(async (element) => {
      let statusFoundForElement = false; // Flag to track if a match has been found for the current element
    
      element.status?.find((status) => {
        // console.log("om", status?.date?.toISOString()?.split('T')[0], formattedDate);

          if (status?.date?.toISOString()?.split('T')[0] === date.toISOString()?.split('T')[0]) {
          element.status = status;
      
          myTask.push(element);
          statusObject.push(status);
          statusFoundForElement = true; // Set the flag to true if a match is found for this element
          return true; // Exit the find loop
        }
        return false;
      });
    
      if (!statusFoundForElement) {
        again=true
        // Create a new status entry for the current element
        const newStatus = { date: date, done: false };
        element.status.push(newStatus);
        
        // Save the updated element with the new status entry
          await element.save();
        console.log("------------------------------------------------------------------",newStatus)
        myTask.push(element);
      }
    });
     


    return res.status(200).json({
      status: true,
      tasks: myTask,
      again:again
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error getting tasks: ${error.message}`,
    });
  }
};

const updateTaskall = async (req, res) => {
    try {
        console.log("sucees");
        const taskId = req.params.id; // Assuming the task ID is passed as a route parameter
        const { title, subTitle, dateTime, scheduleType, dayOfMonth, dayOfWeek, selectedDateText } = req.body;

        // Construct the updated task data
        const updatedTaskData = {
            title,
            subTitle,
            dateTime,
            scheduleType,
            dayOfMonth,
            dayOfWeek,
            selectedDateText,
       
        };

        // Update the task in the database
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: updatedTaskData },
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({
                status: false,
                message: "Task not found or not updated.",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Task updated successfully.",
            data: updatedTask,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: `Error updating task: ${error.message}`,
        });
    }
};

module.exports = { updateTask };
module.exports = {
  insertTask,
  updateTask,
  deleteTask,
    getTasks, updateTaskall
}











