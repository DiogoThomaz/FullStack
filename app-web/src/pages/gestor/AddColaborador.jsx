import React from "react";
import MyLayout from "../../components/conteudo/MyLayout";
import { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
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
import Carregando from "../../components/progresso/Carregando";

const CadastroUsuario = () => {
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [gmail, setGmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [squadSelecionada, setSquadSelecionada] = useState("");
  const [cargo, setCargo] = useState("");
  const [dataContratacao, setDataContratacao] = useState("");
  const [open, setOpen] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errado, setErrado] = useState(false);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClickOpen('carregando');
    setTimeout(()=>{
        console.log('carregando..')
    }, 1000)
    // formata data de contratação para o formato yyyy-mm-dd
    const dataContratacaoFormatada = dataContratacao
      .split("/")
      .reverse()
      .join("-");
    const data = {
      matricula: matricula,
      nome: nome,
      email: email,
      gmail: gmail,
      senha: senha,
      tipo_contrato: tipoContrato,
      tipo_usuario: tipoUsuario,
      id_squad: squadSelecionada,
      ativo: ativo,
      cargo: cargo,
      data_contratacao: dataContratacaoFormatada,
    };
    console.log(data);
    axios
      .post("http://localhost:3001/usuario/signup", data)
      .then((res) => {
        setErrado(false);
        setCarregando(false);
        setSucesso(true);
        console.log(res);
        setTimeout(() => {
            setOpen(false);
        }, 10000);
      })
      .catch((err) => {
        
        setCarregando(false);
        setSucesso(false);
        setErrado(true);
        console.log(err);
        setTimeout(() => {
            setOpen(false);
        }, 10000);
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 2, margin: "auto", maxWidth: 500, flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          align="center"
        >
          Cadastre um novo usuário
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="matricula"
            label="Matrícula"
            name="matricula"
            autoComplete="matricula"
            autoFocus
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="nome"
            label="Nome"
            name="nome"
            autoComplete="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="gmail"
            label="Gmail"
            name="gmail"
            autoComplete="gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="senha"
            label="Senha"
            name="senha"
            autoComplete="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="tipoContrato">Tipo de Contrato</InputLabel>
            <Select
              labelId="tipoContrato"
              id="tipoContrato"
              value={tipoContrato}
              label="Tipo de Contrato"
              onChange={(e) => setTipoContrato(e.target.value)}
            >
              <MenuItem value={"CLT"}>CLT</MenuItem>
              <MenuItem value={"PJ"}>PJ</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="tipoUsuario">Tipo de Usuário</InputLabel>
            <Select
              labelId="tipoUsuario"
              id="tipoUsuario"
              value={tipoUsuario}
              label="Tipo de Usuário"
              onChange={(e) => setTipoUsuario(e.target.value)}
            >
              <MenuItem value={"GESTOR"}>GESTOR</MenuItem>
              <MenuItem value={"COLABORADOR"}>COLABORADOR</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="squad">Squad</InputLabel>
            <Select
              labelId="squad"
              id="squad"
              value={squadSelecionada}
              label="Squad"
              onChange={(e) => setSquadSelecionada(e.target.value)}
            >
              {JSON.parse(localStorage.getItem("squads")).map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="ativo">Ativo</InputLabel>
            <Select
              labelId="ativo"
              id="ativo"
              value={ativo}
              label="Ativo"
              onChange={(e) => setAtivo(e.target.value)}
            >
              <MenuItem value={true}>Sim</MenuItem>
              <MenuItem value={false}>Não</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="cargo"
            label="Cargo"
            name="cargo"
            autoComplete="cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="dataContratacao"
            name="dataContratacao"
            type="date"
            value={dataContratacao}
            onChange={(e) => setDataContratacao(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cadastrar
          </Button>
          <div>
            <Dialog
              open={open}
              transitionDuration={350}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>
                  { carregando && 'Aguarde' }
                  { sucesso && 'Sucesso!'}
                  { errado && 'Algo deu errado!'}
              </DialogTitle>
              <DialogContent align="center">
                <DialogContentText id="alert-dialog-slide-description">
                  { carregando && 'Cadastrando usuário..' }
                  { sucesso && 'O usuário foi cadastrado na sua squad!'}
                  { errado && 'não foi possível cadastrar o usuário'}
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
  );
};

const AddColaborador = () => {
  return (
    <MyLayout
      children={<CadastroUsuario />}
      hasSideBar={true}
      hasRightBar={true}
    />
  );
};

export default AddColaborador;
