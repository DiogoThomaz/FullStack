import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Stack,
  Container,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { Avatar } from "@mui/material";
import MyLayout from "../../components/conteudo/MyLayout";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";


 const Colaboradores = () => {

  const columns2 = [
    { id: "avatar", label: "Avatar", flexGrow: 1 },
    { id: "nome", label: "Name", flexGrow: 1 },
    { id: "email", label: "Email", flexGrow: 1 },
    { id: "cargo", label: "Cargo", flexGrow: 1 },
    { id: "data_contratacao", label: "Contratação", flexGrow: 1 },
    { id: "acoes", label: "Ações", flexGrow: 1 }
  ];

     // deleta usuario da squad
     const handleDelete = (id) => {
      axios
        .delete(`http://localhost:3001/usuario/${id}`)
        .then((res) => {
          console.log(res);
          alert("Usuario deletado da squad");
        })
        .catch((err) => {
          console.log(err);
          alert('Erro ao deletar usuario da squad');
        });
    };

  // request para pegar os dados do colaborador
  const [rows2, setRows2] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:3001/usuario/gestor/${JSON.parse(localStorage.getItem("usuario")).id}`)
      .then((res) => {
        setRows2(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ handleDelete ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

 


   return (
     <Box>
       <Container>
         <Grid container spacing={1} mb={2}>
           <Grid item xs={12}>
             <Paper elevation={6}>
               <Typography variant="body1" align="center">
                 Gerenciar squad
               </Typography>
             </Paper>
           </Grid>
           <Grid item xs={12}>
             <Paper elevation={6}>
               <TableContainer>
                 <Table stickyHeader aria-label="sticky table">
                   <TableHead>
                      <TableRow>
                        {columns2.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows2
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                              {columns2.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {column.id === "avatar" ? (
                                      <Avatar>{row.avatar}</Avatar>
                                    ) : column.id === "acoes" ? (
                                      <Stack direction="row" spacing={1}>
                                        <Button
                                          variant="contained"
                                          color="error"
                                          startIcon={<Delete />}
                                          onClick={ () => handleDelete(row.id)}
                                        >
                                          Excluir
                                        </Button>
                                      </Stack>
                                    ) : (
                                      value
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows2.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
};

const VerEquipe = () => {
  return (
    <MyLayout
      title="Ver Equipe"
      description="Ver Equipe"
      children={<Colaboradores />}
      hasRightBar={true}
      hasSideBar={true}
    />
  );
};

export default VerEquipe;
