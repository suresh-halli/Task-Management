import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { TextField, Button, Container, Typography, Box, Grid } from "@mui/material";
import { z } from "zod";


const schema = z.object({
  fname: z.string().min(2, "First name must be at least 2 characters"),
  lname: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), 
  });

  const onSubmit = async (data) => {
    try {
       await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = auth.currentUser;
      
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: data.fname,
          lastName: data.lname || "",
          photo: "",
        });
      }

      toast.success("User Registered Successfully!!", { position: "top-center" });
    } catch (error) {
      console.error(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                size="small"
                {...register("fname")}
                error={!!errors.fname}
                helperText={errors.fname?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                size="small"
                {...register("lname")}
                error={!!errors.lname}
                helperText={errors.lname?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                size="small"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                size="small"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
          </Grid>

         
          <Button type="submit"  variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Typography variant="body2" align="center">
            Already registered? <a href="/login">Login</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
