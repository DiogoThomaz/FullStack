import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ListItem,
  ListItemButton,
  Typography,
  Avatar,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
} from "@mui/material";
import { Assignment, Person } from "@mui/icons-material";
import { BsEye } from "react-icons/bs";
import SvgIcon from "@mui/material/SvgIcon";
import { pink } from "@mui/material/colors";
import axios from "axios";

function PersonIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

function SvgIconsColor({ cor }) {
  return (
    <Box sx={{ "& > :not(style)": { m: 2 } }}>
      {cor === "vermelho" ? <Person color="error" /> : ""}
      {cor === "verde" ? <Person color="success" /> : ""}
    </Box>
  );
}

const DashboardTable = () => {
  const headers = ["Data", "Nome", "Férias aprovada em", "ver solicitação"];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const idGestor = JSON.parse(localStorage.getItem("usuario")).id;
    axios
      .get(`http://localhost:3001/solicitacoes/relatorio-ferias-d4/${idGestor}`)
      .then((res) => {
        setRows(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [open, setOpen] = useState(false);
  const handleDialog = (row) => {
    console.log(row);
    setSelectedRow(row);
    setOpen(!open);
  };

  const [selectedRow, setSelectedRow] = useState({});
  useEffect(() => {
    setSelectedRow(rows);
  }, [rows]);

  return (
    <Box sx={{ height: "100%" }}>
      <TableContainer component={Paper}>
        <Typography variant="h6" gutterBottom align="center">
          Calendário de Férias
        </Typography>
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
            {rows.map((row) => (
              <TableRow key={row.nome} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="center">
                  <ListItem>
                    <ListItemText primary={row.data} secondary={row.status} />
                  </ListItem>
                </TableCell>
                <TableCell align="center">
                  <ListItem>
                    <ListItemIcon>
                      {row.status === "Saindo" ? <Person color="error" /> : <Person color="success" />}
                    </ListItemIcon>
                    <ListItemText primary={row.nome} secondary={row.cargo} />
                  </ListItem>
                </TableCell>
                <TableCell align="center">
                  <ListItem>
                    <ListItemText primary={row.feriasAprovadaEm}/>
                  </ListItem>
                </TableCell>
                <TableCell align="center">
                  <ListItem>
                    <ListItemButton>
                      <Button variant="contained" endIcon={<Assignment />} onClick={() => handleDialog(row)}>
                        Ver solicitação
                      </Button>
                    </ListItemButton>
                  </ListItem>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleDialog}>
        <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText primary="Solicitação de férias" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Nome" secondary={selectedRow.nome} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Sua observação" secondary={selectedRow.comentario_gestor == "" ? 'Não houve': selectedRow.comentario_gestor} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary={`Observação do ${selectedRow.nome}`} secondary={selectedRow.comentario_colaborador == null ? 'Não houve': selectedRow.comentario_colaborador } />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Data da aprovação" secondary={selectedRow.feriasAprovadaEm} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Status" secondary={selectedRow.status} />
            </ListItem>
          </List>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DashboardTable;