
import React from "react";
import { useDrag } from "react-dnd";
import Typography from "@mui/material/Typography";
import { Card, CardContent } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const ItemType = "TASK";

const TaskCard = ({ task,currentUserEmail}) => {
  const canDrag = task.allocateto?.toLowerCase() === currentUserEmail?.toLowerCase();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [task]);

  return (
    <Card
      ref={canDrag ? drag : null} 
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: canDrag ? "grab" : "not-allowed",
        textAlign:"left",
        backgroundColor:"ButtonHighlight",
        borderRadius:"5px"
        
      }}
    >
      <CardContent>
        <Typography variant="p" style={{fontWeight:"bold"}}>{task.title}</Typography>
        <Typography variant="body2">
          {task.allocateto || "Unassigned"}
        </Typography>
        <Typography variant="body2">
          <CalendarTodayIcon fontSize="5px"/> {task.dueDate}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
