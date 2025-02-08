import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      // console.log(user);
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

 
  return (
    <div>
      {userDetails ? (
        <>
          {/* <div style={{ display: "flex", justifyContent: "center", marginTop:10 }}>
          <img
              src={userDetails.photo }
              width={"40%"}
              style={{ borderRadius: "50%" }}
            />
          </div> */}
          <h3>Welcome {userDetails.firstName} </h3>
          <div>
            <p>Email: {userDetails.email}</p>
            <p>First Name: {userDetails.firstName}</p>
            <p>Last Name: {userDetails.lastName}</p>
          </div>
         
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default Profile;
