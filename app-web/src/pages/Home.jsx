import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import icone from "../assets/icone.png";
import axios from "axios";

const Icone = () => {
  return <img src={icone} alt="icone" width="100px" height="100px" />;
};

function Copyright(props) {
  return (
    <Typography variant="body2" sx={{color: "#FFFFFF"}} align="center" {...props} >
      {'© '}
      <Link color="inherit" href="https://queroquero.com.br/">
        {'Quero - Quero'}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function Home() {
 
    const getLogin = () => {
        window.location.href = "/";
    }

    const getCadastro = () => {
        window.location.href = "/cadastro";
    }

  return (
    <Box sx={{backgroundColor: "#1E7443", display: "flex", height: "100vh", color: "#FFFFFF"}}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Icone sx={{mt: 1}} />
          <Box sx={{ mt: 10 }}>
            <Button
              onClick={getLogin}
              fullWidth
              variant="contained"
              sx={{ mt: 3, background: "#282928" }}
            >
              INICIAR SESSÃO
            </Button>
            <Button
              onClick={getCadastro}
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2, background: "#FFFFFF", color: "#282928" }}
            >
              CRIAR CONTA
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}