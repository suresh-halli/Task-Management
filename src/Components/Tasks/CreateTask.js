import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { tasksCollection } from "../firebase";

import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress
} from "@mui/material";
import { logAction } from "../Logs/LogServices";
import { toast } from "react-toastify";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    allocateto: "",
    dueDate: "",
    priority: "Low",
    status: "To Do",
  });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "Users");
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          email: doc.data().email
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let tempErrors = {};

    // Validate all fields
    if (!formData.title.trim()) tempErrors.title = "Title is required";
    if (!formData.description.trim()) tempErrors.description = "Description is required";
    if (!formData.allocateto) tempErrors.allocateto = "Please select a user";
    if (!formData.dueDate) tempErrors.dueDate = "Due date is required";
    if (!formData.priority) tempErrors.priority = "Priority is required";
    if (!formData.status) tempErrors.status = "Status is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const docRef = await addDoc(tasksCollection, {
        ...formData,
        createdBy: auth.currentUser.uid,
      });

      await logAction(docRef.id, "Task Created", {
        title: formData.title,
        priority: formData.priority,
        status: formData.status,
        allocatedTo: formData.allocateto,
      });
      toast.success("Task Added")
      setFormData({
        title: "",
        description: "",
        allocateto: "",
        dueDate: "",
        priority: "Low",
        status: "To Do",
      });
      setErrors({});
      setTimeout(() => {
        window.location.href = '/taskdetails'
      },1000)

    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setSubmitting(false); // Stop loading
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 2, boxShadow: 3, borderRadius: 2, mt: 5 }}>
      <Typography variant="h6" mb={2}>Create and Allocate Task</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              size="small"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.allocateto} required>
              <InputLabel>Allocate To</InputLabel>
              <Select
                size="small"
                name="allocateto"
                value={formData.allocateto}
                onChange={handleChange}
                label="Allocate To"
              >
                {loading ? (
                  <MenuItem disabled>Loading users...</MenuItem>
                ) : (
                  users.map((user) => (
                    <MenuItem key={user.id} value={user.email}>
                      {user.email}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.allocateto && (
                <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>
                  {errors.allocateto}
                </span>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              type="date"
              size="small"
              name="dueDate"
              label="Due Date"
              value={formData.dueDate}
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
                size="small"
                name="priority"
                value={formData.priority}
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
                size="small"
                name="status"
                value={formData.status}
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
            <TextField
              required
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              multiline
              fullWidth
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {submitting ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Task"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CreateTask;