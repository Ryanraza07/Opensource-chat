import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from './context/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const defaultTheme = createTheme();

export default function Authentication() {
 const [username,setUsername] =  React.useState();
 const [password,setPassword] = React.useState();
 const [name,setName] = React.useState();
 const [error,setError] = React.useState();
 const [formState,setFormState] = React.useState(0);
 const [showPassword, setShowPassword] = React.useState(false);
 const [messages,setMessages] = React.useState();
 const [open,setOpen] = React.useState(false);

 const [isLoading, setIsLoading] = React.useState(false);

 const { handleRegister, handleLogin} = React.useContext(AuthContext);
 let handleAuth = async (e) => {
  try {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (formState === 0) {
      setError("");
      try {
        let result = await handleLogin(username, password);
        if (result) {
          setMessages("Login successful");
          setOpen(true);
          setError("");
        }
      } catch (loginError) {
        setError(loginError?.response?.data?.message || "Login failed");
        setOpen(true);
      }
    }

    if (formState === 1) {
      if (!name) {
        setError("Please fill in all fields");
        return;
      }
      try {
        let result = await handleRegister(name, username, password);
        
        setName("");
        setUsername("");
        setPassword("");
        setMessages("Registration successful! Please login");
        setOpen(true);
        setError("");
        setFormState(0);
        
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
      } catch (registerError) {
        setError(registerError?.response?.data?.message || "Registration failed");
        setOpen(true);
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    setError(error?.response?.data?.message || "An error occurred");
    setOpen(true);
  }
 }
 const handleClickShowPassword = () => {
   setShowPassword(!showPassword);
 };

 const handleMouseDownPassword = (event) => {
   event.preventDefault();
 }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ 
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            backgroundImage: 'url(https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#f5f5f5',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(2px)',
            },
            '@media (max-width: 600px)': {
              display: 'none'
            }
          }}
        />
        <Grid 
          item 
          xs={12} 
          sm={8} 
          md={5} 
          component={Paper} 
          elevation={24}
          sx={{
            position: 'relative',
            zIndex: 1,
            margin: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ 
              m: 1, 
              bgcolor: 'secondary.main',
              width: 56,
              height: 56,
              boxShadow: '0 0 20px rgba(0,0,0,0.1)'
            }}>
              <LockOutlinedIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <div style={{ 
              marginTop: '20px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px'
            }}>
              <Button 
                variant={formState === 0 ? "contained" : "outlined"}
                onClick={() => {setFormState(0)}}
                sx={{
                  borderRadius: '25px',
                  padding: '10px 30px',
                }}
              >
                Sign In
              </Button>
              <Button 
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => {setFormState(1)}}
                sx={{
                  borderRadius: '25px',
                  padding: '10px 30px',
                }}
              >
                Sign Up
              </Button>
            </div>
            <Box component="form" noValidate sx={{ 
              mt: 1,
              width: '100%',
              '& .MuiTextField-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderRadius: '10px',
                },
              },
              '& .MuiButton-root': {
                borderRadius: '25px',
                padding: '12px',
                fontSize: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }
            }}>
              {formState === 1 ?
              <TextField
                margin="normal"
                required
                fullWidth
                id="fullname"
                label="Full name"
                name="fullname"
                autoFocus
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
              />: <></>}
              <TextField
                margin="normal"
                required
                fullWidth
                name="Email"
                label="Email"
                type="text"
                id="email"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password || ''}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <p style={{color:'red'}}>
                {error}
                
              </p>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : formState === 0 ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

                <Snackbar
                open={open}
                autoHideDuration={4000}
                message={messages}
                />


    </ThemeProvider>
  );
}

const handleLogin = async (username, password) => {
  try {
    const response = await axios.post('/api/login', {
      username,
      password
    }, {
      timeout: 5000
    });
    
    if (response.data) {
     
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

