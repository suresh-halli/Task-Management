import React from "react";
import { useDrop } from "react-dnd";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import TaskCard from "./TaskCard";


const ItemType = "TASK";

const Column = ({ status, tasks, moveTask, loadingTask,currentUserEmail }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => {
      console.log("Dropped Task:", item, "New Status:", status);
      moveTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Paper
      ref={drop}
      style={{
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        padding:  "8px",
        maxWidth:"80%",
        minHeight: "200px",
        backgroundColor: isOver ? "#f0f0f0" : "white",
      }}
    >
      {tasks.length === 0 ? (
        null
      ) : (
        tasks.map((task) => (
          <div key={task.id} style={{ position: "relative", marginBottom: 10 }}>
            {loadingTask === task.id ? (
              <CircularProgress
                size={24}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ) : (
             
              <TaskCard task={task}  currentUserEmail={currentUserEmail}/>
           
            )}
          </div>
        ))
      )}
    </Paper>
  );
};

export default Column;
