import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const LogsTable = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const querySnapshot = await getDocs(collection(db, "logs"));
      setLogs(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchLogs();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="logs table">
        <TableHead>
          <TableRow>
            <TableCell>Performed by</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.performedBy}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{JSON.stringify(log.details)}</TableCell>
              <TableCell>{log.timestamp?.toDate().toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogsTable;
