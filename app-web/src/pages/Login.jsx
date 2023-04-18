import React, { useState } from "react";
import {
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Theme from "../components/theme/theme";
import {
  MainVerde,
  Box,
  Espaco,
  LetraDecorada,
  BotaoPreto,
  InputPadrao,
  SpanLI,
  InputPadrao2,
} from "../components/layout";

import API from "../api/api";
import axios from "axios";
import icone from "../assets/icone.png";

const Icone = () => {
  return <img src={icone} alt="icone" width="100px" height="100px" />;
};

const Login = () => {
  // pega os dados dos inputs
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // evento de mudança do input email
  const EmailEvent = (event) => {
    setEmail(event.target.value);
  };

  // evento de mudança do input senha
  const SenhaEvent = (event) => {
    setSenha(event.target.value);
  };

  // redireciona para gestor home
  const redirecionaGestor = () => {
    window.location.href = "/gestor";
  };

  const redirecionaColaborador = () => {
    window.location.href = "/colaborador";
  };

  // pega os dados dos inputs react e envia para o backend
  const EnviarDados = () => {
    console.log(email, senha);
    axios
      .post("http://localhost:3001/usuario/signin", {
        email: email,
        senha: senha,
      })
      .then((res) => {
        console.log(res.data);
        alert("Login realizado com sucesso!");
        localStorage.setItem("token", res.data.jwtToken);
        localStorage.setItem("tipo_usuario", res.data.tipo_usuario);
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

        if (res.data.tipo_usuario === "GESTOR") {
          localStorage.setItem("squads", JSON.stringify(res.data.squads));
          redirecionaGestor();
        }
        if (res.data.tipo_usuario === "COLABORADOR") {
          redirecionaColaborador();
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <MainVerde>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Icone />
          <Espaco>
            <Typography variant="subtitle">Iniciar Sessão</Typography>
          </Espaco>
          <InputPadrao
            label="email"
            type="text"
            placeholder="Email"
            onChange={EmailEvent}
            value={email}
            sx={{ width: "100%" }}
          />

          <InputPadrao
            label="senha"
            type="password"
            placeholder="Senha"
            onChange={SenhaEvent}
            value={senha}
          />
          <Grid container>
            <Grid item xs>
              <Link href="/esqueci" variant="body2" sx={{ color: "#FFFFFF" }}>
                Esqueceu a senha?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/cadastro" variant="body2" sx={{ color: "#FFFFFF" }}>
                Não tem uma conta? <span>Cadastre-se</span>
              </Link>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            sx={{ background: "#282928" }}
            onClick={EnviarDados}
          >
            ENTRAR
          </Button>
        </Box>
      </Container>
    </MainVerde>
  );
};

export default Login;
