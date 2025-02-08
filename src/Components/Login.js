import * as React from 'react';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignInwithGoogle from "./SignInWithGoogle";


const defaultTheme = createTheme(); 

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), 
  });

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("User logged in Successfully");
      window.location.href = "/profile";
      toast.success("User logged in Successfully", { position: "top-center" });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
 
    <ThemeProvider theme={defaultTheme}>
   
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
           
            <TextField
              margin="normal"
              required
              fullWidth
              size="small"
              label="Email Address"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
           
            <TextField
              margin="normal"
              required
              fullWidth
              size="small"
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
           
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
          <Grid item>
            <Link href="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
          <Box sx={{ mt: 2, width: '100%' }}>
            <SignInwithGoogle />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
 