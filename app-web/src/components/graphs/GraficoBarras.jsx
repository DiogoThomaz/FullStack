import { ListSubheader, MenuList } from '@material-ui/core';
import { Avatar, Box, Container, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Typography } from '@mui/material';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default class GraficoBarras extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activeIndex: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const idGestor = JSON.parse(localStorage.getItem("usuario")).id;
    axios.get(`http://localhost:3001/solicitacoes/relatorio-ferias-d3/${idGestor}`)
      .then(response => {
        const data = response.data;
        this.setState({ data });
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }

  handleClick(data, index) {
    this.setState({ activeIndex: index });
  }

  render() {
    const { activeIndex, data } = this.state;
    const activeItem = data[activeIndex] || { qtd: 0, nomes: [], dia: [] };

    return (
      <Box sx={{ height: "100%" }}>
        <Paper sx={{ height: "100%", marginTop: "auto", marginBottom: "auto" }}>
          <Container sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom align='center'>
              Saindo de Férias
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}
                width={500}
                height={300}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
                barSize={50}
              >
                <Bar dataKey="qtd" onClick={this.handleClick} >
                  {data.map((entry, index) => (
                    <Cell cursor="pointer" fill={index === activeIndex ? '#96D866' : '#64AF58'} key={`cell-${index}`} />
                  ))}
                </Bar>
                <XAxis dataKey="name" />

              </BarChart>
            </ResponsiveContainer>
            {/* retorna o nome, dia e avatar do funcionario que está saindo de férias */}
            <List
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  {activeItem.qtd} saindo em {activeItem.name}
                </ListSubheader>
              }
            >
              {activeItem.nomes.map((nome, index) => (
                <ListItemButton key={index}>
                  <ListItemIcon>
                    <Avatar>{nome[0]}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary={nome} secondary={activeItem.dia[index]} />
                </ListItemButton>
              ))}
            </List>
          </Container>
        </Paper>
      </Box>
    );
  }
}
