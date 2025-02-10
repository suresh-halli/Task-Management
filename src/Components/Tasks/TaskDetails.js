import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select,
  InputLabel, FormControl, Box, CircularProgress, Grid,
} from "@mui/material";
import { logAction } from "../Logs/LogServices";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const taskData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const userEmails = querySnapshot.docs.map((doc) => doc.data().email);
        setUsers(userEmails);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);


  const validateForm = () => {
    let tempErrors = {};

    if (!currentTask.title?.trim()) tempErrors.title = "Title is required";
    if (!currentTask.description?.trim()) tempErrors.description = "Description is required";
    if (!currentTask.allocateto?.trim()) tempErrors.allocateto = "Assign to is required";
    if (!currentTask.dueDate) tempErrors.dueDate = "Due date is required";
    if (!currentTask.priority) tempErrors.priority = "Priority is required";
    if (!currentTask.status) tempErrors.status = "Status is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleDelete = async (id) => {
    try {
      const taskToDelete = tasks.find((task) => task.id === id);
      await deleteDoc(doc(db, "tasks", id));
      await logAction(id, "Task Deleted", {
        title: taskToDelete.title,
        message: `Task "${taskToDelete.title}" was deleted.`
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateClick = (task) => {
    setCurrentTask(task);
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask(null);
    setErrors({});
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await updateDoc(doc(db, "tasks", currentTask.id), currentTask);
      await logAction(currentTask.id, "Task Updated", {
        title: currentTask.title,
        priority: currentTask.priority,
        status: currentTask.status,
      });
      setTasks(tasks.map((task) => (task.id === currentTask.id ? { ...task, ...currentTask } : task)));
      handleClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleChange = (e) => {
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter((task) => (priorityFilter ? task.priority === priorityFilter : true))
    .sort((a, b) => (sortOrder === "asc" ? a.dueDate.localeCompare(b.dueDate) : b.dueDate.localeCompare(a.dueDate)));

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Button variant="contained" onClick={() => navigate('/task')}>Create Task</Button>
        <TextField
          label="Search Task By Title"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "230px" }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Priority</InputLabel>
          <Select    label="Priority" size="small" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table sx={{ minWidth: 650 }} aria-label="task table">
          <TableHead style={{ backgroundColor: "#33a8ff" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                  <Box sx={{ mt: 1 }}>Loading tasks...</Box>
                </TableCell>
              </TableRow>
            ) : filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No tasks found</TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <Button variant="text" color="primary" onClick={() => handleUpdateClick(task)}><EditIcon /></Button>
                    <Button variant="text" color="secondary" onClick={() => handleDelete(task.id)} sx={{ ml: 1 }}><DeleteIcon /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={currentTask?.title || ""}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                name="description"
                label="Description"
                value={currentTask?.description || ""}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="date"
                name="dueDate"
                label="Due Date"
                value={currentTask?.dueDate || ""}
                onChange={handleChange}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.priority} required>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={currentTask?.priority || ""}
                  onChange={handleChange}
                  label="Priority"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
                {errors.priority && (
                  <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>
                    {errors.priority}
                  </span>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.status} required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentTask?.status || ""}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
                {errors.status && (
                  <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>
                    {errors.status}
                  </span>
                )}
              </FormControl>
            </Grid>


            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.allocateto} required>
                <InputLabel>Assign to</InputLabel>
                <Select
                  name="allocateto"
                  value={currentTask?.allocateto || ""}
                  onChange={handleChange}
                  label="Assign to"
                >
                  {users.map((email, index) => (
                    <MenuItem key={index} value={email}>{email}</MenuItem>
                  ))}
                </Select>
                {errors.allocateto && (
                  <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>
                    {errors.allocateto}
                  </span>
                )}
              </FormControl>
            </Grid>


          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskList;