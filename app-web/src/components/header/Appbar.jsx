import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Notifications from '@mui/icons-material/Notifications';
import { Badge, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, MenuList, styled } from '@mui/material';
import { LetraDecorada } from '../layout';
import { useEffect } from 'react';
import axios from 'axios';
import { Check, Mail, MarkEmailRead, Opacity } from '@mui/icons-material';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function Appbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [qtdNotificacoes, setQtdNotificacoes] = React.useState(0);
  const [notificacao, setNotificacao] = React.useState([]);



  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRead = (notificacao) => {
    const id = notificacao.id
    console.log(id)
    axios.patch(`http://localhost:3001/notificacao/${id}`, { lida: true })
      .then((response) => {
        console.log(response)
        setQtdNotificacoes(qtdNotificacoes - 1)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect( () => {
    const id = JSON.parse(localStorage.getItem('usuario')).id
    axios.get(`http://localhost:3001/notificacao/minhas/${id}`)
      .then((response) => {
        setQtdNotificacoes(response.data.filter((notificacao) => notificacao.lida === false).length)
        setNotificacao(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [setNotificacao, setQtdNotificacoes, handleRead])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2,  display: { sm: 'block', xs: 'block', md: 'none', lg: 'none'} }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h1" 
            component="div" 
            sx={{ flexGrow: 1 }}
            align="center"
            >
            Quero <LetraDecorada>férias</LetraDecorada>
          </Typography>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                aria-controls='menu-appbar'
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Badge badgeContent={qtdNotificacoes} color="error">
                <Notifications />
                </Badge>
                
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <Typography variant='h6' align='center'>
                          Notificações
                    </Typography>
                  {notificacao.map((notificacao) => {
                    return (
                      <ListItem
                        key={notificacao.id}
                        secondaryAction={
                          notificacao.lida == true ? null :
                            <IconButton 
                              edge="end" 
                              aria-label="comments"
                              onClick={()=> handleRead(notificacao)}
                              >
                              <Check  />
                            </IconButton>
                         }
                      >
                          <ListItemAvatar>
                            {notificacao.lida == false ? <Mail/> : <MarkEmailRead/>}
                          </ListItemAvatar>
                          <ListItemText 
                            primary={
                              <React.Fragment>
                                <Typography 
                                  sx={{ 
                                    display: 'flex',
                                    flexWrap: "wrap",
                                    wordBreak: 'break-word',
                                    maxWidth: "100%",
                                    whiteSpace: "normal"
                                  }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {notificacao.mensagem}
                                </Typography>
                              </React.Fragment>} 
                            />
                        </ListItem>
                    
                    )
                  })
                }
                </List>
                </MenuItem>
              </Menu>
        </Toolbar>
      </AppBar>
      <Offset />
    </Box>
  );
}