import React, { useEffect, useState } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import { auth } from "./Components/firebase";
import Profile from "./Components/Profile";
import CreateTask from "./Components/Tasks/CreateTask";
import TaskList from "./Components/Tasks/TaskDetails";
import KanbanBoard from "./Components/Kanban/kanbanBoard";
import LogsTable from "./Components/Logs/LogsDetails";
import Appbar from "./Components/Appbar";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p></p>; 

  return (
    <Router>
      <Appbar user={user} />
      <div className="App"> 
        <div className="auth-wrapper"> 
          <div className="auth-inner">
            <Routes>
              <Route path="/"element={user ? <Navigate to="/profile" /> : <Login />}/>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/profile" element={<PrivateRoute element={<Profile />} user={user} />} />
              <Route path="/task" element={<PrivateRoute element={<CreateTask />} user={user} />} />
              <Route path="/taskdetails" element={<PrivateRoute element={<TaskList />} user={user} />} />
              <Route path="/kanban" element={<PrivateRoute element={<KanbanBoard />} user={user} />} />
              <Route path="/logs" element={<PrivateRoute element={<LogsTable />} user={user} />} />

            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
