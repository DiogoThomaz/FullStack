import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import icone from "../assets/nuvens.png";
import axios from "axios";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState } from 'react';

const Nuvens = () => {
  return <img src={icone} alt="nuvens" />;
};

export default function Cadastro() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleClickOpen();
    const data = new FormData(event.currentTarget);
    console.log({
      nome: data.get('nome'),
      matricula: data.get('matricula'),
      email: data.get('email'),
    });
    axios.post("http://localhost:8000/email/enviar/", {
      "mensagem": `${data.get('nome')} acabou de solicitar o cadastro no sistema Quero Férias. Sua matrícula é ${data.get('matricula')}. Em caso de dúvidas fale com o seu gestor ${data.get('email')}`,
      "destinatario": "diogommtdes@gmail.com",
      "assunto": "Solicitação de cadastro",
      "anexo": "nao"
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
    setTimeout(()=>{
      handleClose();
      window.location.href="/"
    }, 10000)
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
          <Nuvens sx={{mt: 1}} />
          <Typography component="h3" variant="h6" mt={3}>
            {"Olá, colaborador! Vamos começar o seu cadastro."} <br/>
            {"Para isso preencha os campos abaixo."}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome completo"
              name="nome"
              variant="filled"
              autoComplete="nome"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="matricula"
              label="Matrícula"
              type="text"
              id="matricula"
              variant="filled"
              
            />            
            <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email do gestor"
            type="email"
            id="email"
            variant="filled"
          />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, background: "#282928" }}
            >
              ENTRAR
            </Button>
            </Box>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            transitionDuration={350}
          >
            <DialogTitle id="alert-dialog-title">{"Solicitação realizada!"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {"Em breve seu gestor irá te adicionar no sistema."}
              </DialogContentText>
            </DialogContent>
            </Dialog>
        </Box>
      </Container>
    </Box>
  );
}