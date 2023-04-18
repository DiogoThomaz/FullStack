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
    <Typography variant="body2" sx={{color: "#FFFFFF"}} align="center" {...props}>
      {'© '}
      <Link color="inherit" href="https://queroquero.com.br/">
        {'Quero - Quero'}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function Login2() {
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     console.log({
//       email: data.get('email'),
//       password: data.get('password'),
//     });
//   };
const redirecionaGestor = () => {
    window.location.href = "/gestor";
  };

  const redirecionaColaborador = () => {
    window.location.href = "/colaborador";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
   
    axios
      .post("http://localhost:3001/usuario/signin", {
        email: data.get('email'),
        senha: data.get('senha'),
      })
      .then((res) => {
        console.log(res.data);
        alert("Login realizado com sucesso!");
        localStorage.setItem("token", res.data.jwtToken);
        localStorage.setItem("tipo_usuario", res.data.tipo_usuario);
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

        if (res.data.tipo_usuario === "GESTOR") {
          localStorage.setItem("squads", JSON.stringify(res.data.squads));
          redirecionaGestor();
        }
        if (res.data.tipo_usuario === "COLABORADOR") {
          redirecionaColaborador();
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <Box sx={{backgroundColor: "#1E7443", display: "flex", height: "100vh", color: "#FFFFFF"}}>
    
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Icone sx={{mt: 1}} />
          <Typography component="h4" variant="h6" mt={3}>
            Iniciar Sessão
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              variant="filled"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type="password"
              id="senha"
              variant="filled"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, background: "#282928" }}
            >
              ENTRAR
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" sx={{color: "#FFFFFF"}}>
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/cadastro" variant="body2" sx={{color: "#FFFFFF"}}>
                  Não tem uma conta? Cadastre-se
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8}} />
      </Container>
    </Box>
  );
}