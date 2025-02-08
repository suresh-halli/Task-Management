import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; 
import { getAuth } from "firebase/auth";

export const logAction = async (taskId, action, details = {}) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No authenticated user found.");
      return;
    }

    await addDoc(collection(db, "logs"), {
      taskId,
      action,
      performedBy: user.email, 
      timestamp: serverTimestamp(),
      details,
    });

    console.log(`Log recorded: ${action} for task ${taskId} by ${user.email}`);
  } catch (error) {
    console.error("Error logging action:", error);
  }
};
