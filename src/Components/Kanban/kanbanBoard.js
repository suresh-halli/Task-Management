import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Column from "./column";
import { logAction } from "../Logs/LogServices";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loadingTask, setLoadingTask] = useState(null);
  const auth = getAuth();
  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tasks"),
      (snapshot) => {
        setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks");
      }
    );

    return () => unsubscribe();
  }, []);

  // const moveTask = async (id, newStatus) => {
  //   const taskRef = doc(db, "tasks", id);
  //   console.log(taskRef);

  //   const task = tasks.find((t) => t.id === id);

  //   // if (!task.allocateto || task.allocateto.toLowerCase() !== currentUserEmail?.toLowerCase()) {
  //   //   toast.error("You can only move tasks assigned to you");
  //   //   return;
  //   // }

  //   setLoadingTask(id);
  
  //   try {
  //     await updateDoc(taskRef, { status: newStatus });
  //     await logAction(id, "Moved Task", {
  //       from: task.status,
  //       to: newStatus,
  //     });
  //     toast.success("Task status updated successfully");
  //   } catch (error) {
  //     console.error("Error updating task:", error);
  //     toast.error("Failed to update task");
  //   } finally {
  //     setLoadingTask(null);
  //   }
  // };
  const moveTask = async (id, newStatus) => {
    setLoadingTask(id);
  
    try {
      const taskRef = doc(db, "tasks", id);
      const taskSnap = await getDoc(taskRef); 
  
      
  
      const task = taskSnap.data();
  
      await updateDoc(taskRef, { status: newStatus });
  
      await logAction(id, "Moved Task", {
        previousStatus: task.status || "unknown",
        newStatus: newStatus,
      });
  
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } finally {
      setLoadingTask(null);
    }
  };
  
  

  return (
    <DndProvider backend={HTML5Backend}>
        <Box sx={{ textAlign: "center", p: 2 }}>
        <Grid container justifyContent="center" spacing={2}>
          {["To Do", "In Progress", "Done"].map((status) => (
            <Grid item xs={12} sm={4} key={status}>
              <Typography
                variant="h6"
                sx={{ color: "GrayText", textAlign: "left", mb: 1 }}
              >
                {status}
              </Typography>
              <Column
                status={status}
                tasks={tasks.filter((task) => task.status === status)}
                moveTask={moveTask}
                loadingTask={loadingTask}
                currentUserEmail={currentUserEmail}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      
    </DndProvider>
  );
};

export default KanbanBoard;
