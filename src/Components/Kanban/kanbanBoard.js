import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import Column from "./column";

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

  const moveTask = async (id, newStatus) => {
    const taskRef = doc(db, "tasks", id);
    console.log(taskRef);

    const task = tasks.find((t) => t.id === id);

    // if (!task.allocateto || task.allocateto.toLowerCase() !== currentUserEmail?.toLowerCase()) {
    //   toast.error("You can only move tasks assigned to you");
    //   return;
    // }

    setLoadingTask(id);
    try {
      await updateDoc(taskRef, { status: newStatus });
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
        {/* <Typography variant="h6" gutterBottom>
          Task Board
        </Typography> */}
        <Grid container justifyContent="center">
          <Grid
            item
            xs={12}
            sm={10}
            sx={{ display: "flex", justifyContent: "center", gap: 1 }}
          >
            {["To Do", "In Progress", "Done"].map((status) => (
              <Grid item xs={12} sm={6} key={status}>
                <Box
                  sx={{
                    color: "GrayText",
                    borderRadius: "5px",
                    textAlign: "left",
                  }}
                >
                  <Typography variant="h6">{status}</Typography>
                </Box>
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
        </Grid>

      </Box>
    </DndProvider>
  );
};

export default KanbanBoard;
