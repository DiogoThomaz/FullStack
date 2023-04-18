// pagina de edição de perfil do gestor
// pagina também permite ele criar uma nova squad

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Container,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

import MyLayout from "../../components/conteudo/MyLayout";

const EditarPerfil = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [gmail, setGmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [dataContratacao, setDataContratacao] = useState("");
  const [squad, setSquad] = useState("");
  const [squadId, setSquadId] = useState("");
  const [squadList, setSquadList] = useState([]);
  const [open, setOpen] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errado, setErrado] = useState(false);

  const myId = JSON.parse(localStorage.usuario).id;

  const handleClickOpen = (status) => {
    if (status === "sucesso") {
        setErrado(false);
        setCarregando(false);
        setSucesso(true);
        setOpen(true);
    }
    if (status === "carregando") {
        setErrado(false);
        setSucesso(false);
        setCarregando(true);
        setOpen(true);
    }
    if (status === "errado") {
        setCarregando(false);
        setSucesso(false);
        setErrado(true);
        setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    //envia o token no header da requisição do localstorage. Bearer é o padrão do jwt
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem("token")}`;
    axios
      .get(`http://localhost:3001/usuario/meu-perfil/${myId}`)
      .then((response) => {
        setNome(response.data.nome);
        setEmail(response.data.email);
        setGmail(response.data.gmail);
        setSenha(response.data.senha);
        setCargo(response.data.cargo);
        setDataContratacao(response.data.data_contratacao);
      });
  }, []);

  const handleSubmit = (e) => {
    
    e.preventDefault();
    handleClickOpen("carregando");
    const data = {
      nome: nome,
      email: email,
      gmail: gmail,
      senha: senha,
      cargo: cargo,
      data_contratacao: (new Date(dataContratacao).toISOString()),
    };
    axios
      .patch(`http://localhost:3001/usuario/${myId}`, data)
      .then((response) => {
        setErrado(false);
        setCarregando(false);
        setSucesso(true);
        console.log(response);
        setTimeout(()=>{
            setOpen(false)
        }, 10000)
      })
      .catch(err => {
        setCarregando(false);
        setSucesso(false);
        setErrado(true);
        console.log(err);
        setTimeout(() => {
            setOpen(false);
        }, 10000);
      })
  };

  const handleSquadChange = (e) => {
    setSquadId(e.target.value);
  };

  return (
    <MyLayout
      children={
        <Container maxWidth="sm">
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h5" component="h1" gutterBottom>
                Editar Perfil
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nome"
                  variant="outlined"
                  margin="normal"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Gmail"
                  variant="outlined"
                  margin="normal"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Senha"
                  variant="outlined"
                  margin="normal"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Cargo"
                  variant="outlined"
                  margin="normal"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Data de Contratação"
                  variant="outlined"
                  margin="normal"
                  value={new Date(dataContratacao).toLocaleDateString("pt-BR")}
                  onChange={(e) => setDataContratacao(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Salvar
                </Button>
              </form>
              <div>
                <Dialog
                  open={open}
                  transitionDuration={350}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>
                    {carregando && "Aguarde"}
                    {sucesso && "Sucesso!"}
                    {errado && "Algo deu errado!"}
                  </DialogTitle>
                  <DialogContent align="center">
                    <DialogContentText id="alert-dialog-slide-description">
                      {carregando && "Alterando seus dados.."}
                      {sucesso && "Dados alterados."}
                      {errado && "Não foi possível alterar seus dados."}
                    </DialogContentText>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {carregando && <CircularProgress />}
                    </Box>
                  </DialogContent>
                </Dialog>
              </div>
            </Box>
          </Paper>
        </Container>
      }
      hasSideBar={true}
      hasRightBar={true}
    />
  );
};

export default EditarPerfil;
