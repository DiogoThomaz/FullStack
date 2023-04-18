import React, { useState, useEffect, useRef, setOpen} from 'react';
import styles from './header.module.css';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import SearchBox from '../search/Search';
import { DivSpaceAround, NotificacaoIcon, SettingsIcon } from '../layout';
import { Notifications } from '@mui/icons-material';
import { Badge, Box, IconButton, Grid, Avatar } from '@mui/material';

// mock de dados para notificações
const notificacoes = [
  {
    id: 1,
    titulo: 'Notificação 1',
    descricao: 'Descrição da notificação 1',
    data: '01/01/2021',
    lida: false,
  },
  {
    id: 2,
    titulo: 'Notificação 2',
    descricao: 'Descrição da notificação 2',
    data: '01/01/2021',
    lida: false,
  }
];


const menuItems = [{ label: 'Home', path: `${localStorage.tipo_usuario == 'GESTOR' ? '/gestor' : '/colaborador'}` }, { label: 'Sobre', path: '/gestor' }, { label: 'Contato', path: '/gestor' }, { label: 'Sair', path: '/sair' }];

function Header(props) {
  const [isSideBarVisible, setIsSideBarVisible] = useState(false);
  const [sideBarWidth, setSideBarWidth] = useState(0);
  const [selectedItem, setSelectedItem] = useState("");

  function toggleSideBarVisibility() {
    setIsSideBarVisible(!isSideBarVisible);
    setSideBarWidth(isSideBarVisible ? 0 : 200);
  }

  function handleItemClick(item) {
    setSelectedItem(item.path);
    toggleSideBarVisibility();
  }

  useEffect(() => {
    const linkElements = document.querySelectorAll(".menu-link");

    linkElements.forEach((link) => {
      link.style.display = isSideBarVisible ? "block" : "none";
    });
  }, [isSideBarVisible]);



  //acessa localstorage para pegar a primeira letra do nome do usuário
  const nome = localStorage.nome;
  const primeiraLetra = nome.charAt(0);

  return (
    <header className={styles.header}>
      <Grid container alignItems="center">
        <Grid item xs={5}>
          <DivSpaceAround onClick={toggleSideBarVisibility}>
            <h1>Quero <span>férias</span></h1>
          </DivSpaceAround>
        </Grid>
        <Grid item xs />
        <Grid item md>
          <SideBarWrapper style={{ width: `${sideBarWidth}px` }}>
            <Menu>
              {menuItems.map((item, index) => (
                <MenuItem key={index}>
                  <Link to={item.path} className="menu-link" onClick={toggleSideBarVisibility}
                    style={{ textDecoration: "none", color: "white" }}   >
                    {item.label}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </SideBarWrapper>
        </Grid>
        <Grid item xs={6} md={3}>
          <DivSpaceAround>
            <SearchBox />
          </DivSpaceAround>
        </Grid>
        <Grid item xs={1} sm={1}>
          <DivSpaceAround>
            <Box>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                 onClick={
                (e) => setOpen(true)
               }
              >
                <Badge badgeContent={notificacoes} color="error" sx={{ marginTop: "0.2em" }} >
                  <NotificacaoIcon 
                    />
                </Badge>
              </IconButton>
            </Box>
            <Box>
              <IconButton
                size="large"
              // onClick={
              //   (e) => setOpen(true)
              // }
              >
                <Avatar sx={{ marginRight: "0.2em"}}>{primeiraLetra}</Avatar>
              </IconButton >
            </Box>
          </DivSpaceAround>
        </Grid>
      </Grid>
    </header>

  );
}

const SideBarWrapper = styled.div`
  transition: width 0.2s ease-in-out;
  height: 100%;
  background-color: #1E7443;
  position: fixed;
  left: 0;
  top: 3em;
  border-right: 1px solid #E5E5E5;
  font-family: 'Roboto', sans-serif;
  color: #FFFFFF;
  
  @media (min-width: 768px) {
    width: 200px;
  }
`;

const Menu = styled.ul`
  list-style: none;
  padding: 1em;
`;

const MenuItem = styled.li`
  padding: 10px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    font-weight: bold;
    font-size: 1.1em;
    color: #FFFFFF;
  }
`;

const hideLink = styled.a`
  display:none;
`;

export default Header;
