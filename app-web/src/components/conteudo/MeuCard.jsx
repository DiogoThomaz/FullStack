import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";

const MeuCard = ({ imagem, titulo, descricao, link }) => {

  const redirect = () => {
    window.location.href = link;
  };

  const verifyToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3001/usuario/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        redirect();
      })
      .catch((err) => {
        console.log(err);
        window.location.href = "/sair";
        alert("Sessão expirada, logue novamente.");
      });
    } else {
      window.location.href = "/sair";
      alert("Sessão expirada, logue novamente.");
    }
  };

  return (
  
    <Card sx={{ maxWidth: "100%", minHeight: "100%"}}>
      <CardMedia
        component="img"
        height="140"
        image={imagem}
        alt={titulo}
        style={{ objectPosition: "top" }}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {titulo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {descricao}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={verifyToken} size="small">
          Ver Mais
        </Button>
      </CardActions>
    </Card>
  );
};

export default MeuCard;
