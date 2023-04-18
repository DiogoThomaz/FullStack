
import { Avatar, AvatarGroup, Box, Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { ExitToApp, Group, Home } from "@mui/icons-material";
import theme from "../theme/theme";
import { useEffect, useState } from "react";
import axios from "axios";
import Appbar from "../header/Appbar";


const Sidebar = () => {

    // Redireciona para a página inicial do gestor ou colaborador
    const redirectToHome = (e) => {
        e.preventDefault();
        localStorage.tipo_usuario == 'GESTOR' ? 
            window.location.href='/gestor' : window.location.href='/colaborador'
    }

    const sair = (e) => {
        e.preventDefault()
        localStorage.clear()
        window.location.href='/sair'
    }

    const redirectToSquad = (e) => {
        e.preventDefault()
        window.location.href='/gestor/ver-equipe'
    }



    // Elementos do sidebar
    return (
        <Box 
            flex={1}
            p={0.5}
            sx={{ 
                display: { 
                    xs: 'none', 
                    sm: 'none', 
                    md: 'block', 
                    lg: 'block' 
                    }
                }}
            >
            <Box position="fixed">
            <Stack>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={(e)=> redirectToHome(e)} >
                            <ListItemIcon><Home /></ListItemIcon>
                            <ListItemText primary="Início"/>
                        </ListItemButton>
                    </ListItem>
                    {
                    localStorage.tipo_usuario == 'GESTOR' ?
                        <ListItem disablePadding>
                            <ListItemButton onClick={(e) => redirectToSquad(e) } >
                                <ListItemIcon><Group /></ListItemIcon>
                                <ListItemText primary="Squad" />
                            </ListItemButton>
                        </ListItem>
                    : null  
                    }
                    <ListItem disablePadding>
                        <ListItemButton onClick={(e) => sair(e)}>
                            <ListItemIcon><ExitToApp/></ListItemIcon>
                            <ListItemText primary="Sair" />
                        </ListItemButton>
                    </ListItem>
                </List>
                </Stack>
        </Box>
        </Box>
    );
};


// Componente Feed recebe children, que é passado pelo componente myLayout
const Feed = ({ children }) => {
    return (
        <Box flex={9} p={0.5}>
            {children}
        </Box>
    );
};


// Componente Rightbar
const Rightbar = ({ squadId }) => {


    // Busca dados dos colaboradores da squad
    // para exibir seus avatares
    const [colaboradores, setColaboradores] = useState([]);
    const [saldoFerias, setSaldoFerias] = useState(0);

    const getSaldo = async () => {
        try {
            axios.get(`http://localhost:3001/solicitacoes/saldo/${JSON.parse(localStorage.getItem("usuario")).id}`)
            .then(res => {
                setSaldoFerias(res.data);
            })
            .catch(err => console.log(err))
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSaldo();
    }, []);  

     useEffect(() => {
         async function fetchColaboradores() {
           try {
                if(localStorage.getItem("tipo_usuario")=="COLABORADOR") {
                    const response = await axios.get(`http://localhost:3001/usuario/colegas/${JSON.parse(localStorage.getItem("usuario")).id}`)
                    .then(res => {

                        const team = res.data.squad.map(colab => colab);
                        console.log(team);
                        setColaboradores(team);
                    })
                    .catch(err => console.log(err))
                }
                if(localStorage.getItem("tipo_usuario")=="GESTOR" ) {
                    await axios.get(`http://localhost:3001/usuario/gestor/${JSON.parse(localStorage.getItem("usuario")).id}`)
                    .then(res => {
                        const team = res.data.map(colab => {
                            return {
                                id: colab.id,
                                nome: colab.nome
                            }
                        });
                        console.log(team);
                        setColaboradores(team);
                    })
                    .catch(err => console.log(err))
                }
              } catch (error) {
                console.log(error);
                }
            }
            fetchColaboradores();
        }, []);

    
    // Elementos do rightbar
    return (
        <Box
            flex={3}
            p={0.5}
            sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
        >
            {/* --------------------------------------------
                Exibe os avatares dos colaboradores da squad
                Máximo de avatares 6
                --------------------------------------------
            */
            }
            <Box sx={{ position: "fixed" }}>
                <Typography variant="h5" mt={2} mb={2}>Squad</Typography>
                <AvatarGroup max={6} mb={4}>
                    {
                        colaboradores.map((colaborador) => {
                            return (
                                <Avatar
                                    key={colaborador.id}
                                    alt={colaborador.nome}
                                    >
                                    {colaborador.nome[0]}
                                    </Avatar>
                            );
                        })
                    }
                </AvatarGroup>
                <Typography variant="h5" mt={2} mb={2}>Saldo de férias</Typography>
                <Avatar sx={{ background: "#1E7443"}}>
                    <Typography variant="subtitle1">{saldoFerias} d</Typography>
                </Avatar>
            </Box>
        </Box>
    );
};


/* 

*O componente MyLayout recebe como props:
    - hasSideBar: se o componente deve exibir o sidebar
    - hasRightBar: se o componente deve exibir o rightbar
    - children: componente filho que será exibido no feed

    O componente <Box> é o container principal, que contém:
        - Header (Barra superior)
        - Propriedades:
            - bgcolor: cor de fundo (cinza claro)
           !- sx: com min-height de 100vh para que o conteúdo ocupe toda a tela
           
*/
const MyLayout = ({ children, hasRightBar, hasSideBar }) => {
    return (
        <Box 
            bgcolor={ theme.palette.background.default } 
            sx={{ minHeight: '100vh', minWidth: '100vw' }}
            
            >
            <Appbar/>
            <Box>
                <Stack 
                    direction="row" 
                    spacing={2} 
                    justifyContent="space-evenly"
                    >
                    {
                        hasSideBar && (<Sidebar />)
                    }
                    <Feed children={children} />
                    {
                        hasRightBar && (<Rightbar />)
                    }

                </Stack>
            </Box>
        </Box>
    );
}

export default MyLayout;