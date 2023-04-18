// tabela data grid para gestor responder pedido de ferias
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Alert,
  Avatar,
  Box,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import MyLayout from "../../components/conteudo/MyLayout";

// -----------------------------------

import {
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Button,
} from "@mui/material";
import {
  Assignment,
  Check,
  Close,
  DeleteForever,
  Person,
  Refresh,
  RestorePageRounded,
  Send,
} from "@mui/icons-material";

const TabelaDeSolicitacoes = () => {
  const headers = [
    "Nome do colaborador",
    "Aberta em",
    "Sai",
    "Retorna",
    "Status",
    "Ações",
  ];

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const [dialogNsolicitacao, setDialogNsolicitacao] = useState("");
  const [dialogNomeColaborador, setDialogNomeColaborador] = useState("");
  const [dialogAbertura, setDialogAbertura] = useState("");
  const [dialogStatusSolicitacao, setDialogStatusSolicitacao] = useState("");
  const [dialogAcao, setDialogAcao] = useState([])
  const [justificativa, setJustificativa] = useState();
  const [alert, setAlert] = useState(false);

  const handleJustificativa = (e) => {
    e.preventDefault()
    setJustificativa(e.target.value)
  }

  // recusa solicitação no dialogo
  // alerta o usuario que a solicitação foi recusada
  const handleSubmitDialogCancel = (e) => {
    e.preventDefault();
    const sendData = {
      comentario_gestor: justificativa,
      estado: "REPROVADA"
    }
    console.log(dialogNsolicitacao)
    axios.patch(`http://localhost:3001/solicitacoes/${dialogNsolicitacao}`, sendData)
    setOpen(false);
    setDialogAcao(['foi recusada!', 'error'])
    setAlert(true);
    setJustificativa('')
    setTimeout(() => {
        setAlert(false);
        }, 5000);
  };

  // aprova a solicitacao no dialogo
  // alerta usuário sobre ação de sucesso
  const handleSubmitDialogConfirm = (e) => {
    e.preventDefault();
    const sendData = {
      comentario_gestor: justificativa,
      estado: "APROVADO"
    }
    console.log(dialogNsolicitacao)
    axios.patch(`http://localhost:3001/solicitacoes/${dialogNsolicitacao}`, sendData)
    setOpen(false);
    setDialogAcao(['foi aprovada!', 'success'])
    setAlert(true);
    setJustificativa('')
    setTimeout(()=> {
        setAlert(false);
    }, 5000);
  };

  const handleSubmitDialogReturn = (e) => {
    e.preventDefault()
    setJustificativa('')
    setOpen(false)
    setDialogAcao(['permanece pendente.', 'info'])
    setAlert(true)
    setTimeout(() => {
        setAlert(false)
    }, 5000);
  }

  // abre o dialogo com os dados da solicitação
  const handleOpenDialog = (e) => {
    e.preventDefault();
    setOpen(true);
    setDialogNsolicitacao(e.target.value);
    setDialogNomeColaborador(e.target.name);
    setDialogAbertura(e.target.id);
    setDialogStatusSolicitacao(e.target.title);
  };

  // fecha o dialogo
  const handleCloseDialog = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  // pega os dados de solicitações pendentes com o id do gestor
  useEffect(() => {
    const idGestor = JSON.parse(localStorage.getItem("usuario")).id;
    axios
      .get(`http://localhost:3001/solicitacoes/pendentes/${idGestor}`)
      .then((response) => {
        setRows(response.data.solicitacoes);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  , [handleSubmitDialogConfirm, handleSubmitDialogCancel]);

  const handleClose = () => {
    setClose(true);
  };


  return (
    <Box>
      <Paper>
        <Typography variant="h5" align="center" marginBottom={1}>
          Solicitações de férias
        </Typography>
      </Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell align="center" key={header}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.colaborador.nome}</TableCell>
                <TableCell align="center">{(new Date(row.data_abertura)).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell align="center">{(new Date(row.ferias_inicio)).toLocaleDateString('pt-BT')}</TableCell>
                <TableCell align="center">{(new Date(row.ferias_fim)).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell align="center">{row.estado}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    value={row.id}
                    name={row.colaborador.nome}
                    id={row.data_abertura}
                    title={row.estado}
                    onClick={handleOpenDialog}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        transitionDuration={350}
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Solicitação de " + dialogNomeColaborador}
        </DialogTitle>
        <DialogContent align="center">
          <DialogContentText id="alert-dialog-description" textAlign="left">
            <b>Aberta em: </b>
            {(new Date(dialogAbertura)).toLocaleDateString('pt-BR')}
            <br />
            <b>Status: </b>
            {dialogStatusSolicitacao}
            <br />
            <b>Justificativa: </b>
            <br />
            <TextField
              id="outlined-multiline-static"
              label="Justificativa"
              multiline
              rows={4}
              value={justificativa}
              variant="outlined"
              onChange={handleJustificativa}
              required
              fullWidth
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitDialogCancel} color="error">
            Recusar
          </Button>
          <Button onClick={handleSubmitDialogReturn} color="info">
            Pendente
          </Button>
          <Button onClick={handleSubmitDialogConfirm} color="success">
            Aprovar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alert}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={dialogAcao[1]} sx={{ width: "100%" }}>
          Solicitação {dialogAcao[0]}
        </Alert>
      </Snackbar>
    </Box>
  );
};



const SolicitacoesSquad = () => {
  return (
    <MyLayout
      children={
        <Container>
          <TabelaDeSolicitacoes />
        </Container>
      }
      hasRightBar={true}
      hasSideBar={true}
    ></MyLayout>
  );
};

export default SolicitacoesSquad;
