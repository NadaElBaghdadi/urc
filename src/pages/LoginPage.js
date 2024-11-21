import { useState } from "react";
import { loginUser } from "../user/loginApi"; 
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; 

export function Login() {
  const [error, setError] = useState({});
  const [session, setSession] = useState({});
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    console.log("fucking data" , data.get('login'))

    loginUser(
      {
        user_id: -1,
        username: data.get('login').toString(),
        password: data.get('password').toString(),
      },
      (result) => {
        console.log("result",result);
        setSession(result);
        form.reset();
        setError({});
        sessionStorage.setItem('id',result.id)
        localStorage.setItem('token', result.token);
        
        navigate("/messages"); 
      },
      (loginError) => {
        console.log("loginerror:",loginError);
        setError(loginError);
        setSession({});
      }
    );
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom d'utilisateur"
          name="login"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        
        <TextField
          label="Mot de passe"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Connexion
        </Button>
      </form>

      {session.token && (
        <Typography variant="body1" color="primary" align="center" sx={{ marginTop: 2 }}>
          {session.username} : {session.token}
        </Typography>
      )}

      {error.message && (
        <Typography variant="body2" color="error" align="center" sx={{ marginTop: 2 }}>
          {error.message}
        </Typography>
      )}

      <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 2 }}>
        Pas encore de compte ?{" "}
        <Link component={RouterLink} to="/register">
          Inscrivez-vous ici
        </Link>
      </Typography>
    </Box>
  );
}

export default Login;
