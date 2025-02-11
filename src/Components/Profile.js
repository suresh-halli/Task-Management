
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardMedia, Typography, CircularProgress, Box } from "@mui/material";
import profile from '../Images/profileimg.jpeg';

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [photo, setPhoto] = useState(profile);

  useEffect(() => {
    const fetchUserData = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserDetails(data);
            if (!data.photo) {
              setPhoto(profile);
            } else {
              setPhoto(data.photo);
            }
          } else {
            console.log("User data not found");
          }
        }
      });
    };

    fetchUserData();
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt="20px">
      {userDetails ? (
        <Card sx={{ width: 400, textAlign: "center", p: 2, boxShadow: 3 }}>
          <CardMedia
            component="img"
            height="120"
            image={photo}
            alt="Profile"
            sx={{ borderRadius: "50%", width: 120, height: 120, margin: "10px auto" }}
          />
          <CardContent>
            <Typography variant="h5">Welcome, {userDetails.firstName}!</Typography>
            <Typography variant="body1">Email: {userDetails.email}</Typography>
            <Typography variant="body1">First Name: {userDetails.firstName}</Typography>
            <Typography variant="body1">Last Name: {userDetails.lastName || ""}</Typography>
          </CardContent>
        </Card>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}

export default Profile;
