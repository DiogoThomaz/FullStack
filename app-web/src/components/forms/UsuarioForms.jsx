

import React, { Component } from 'react';
import styles from './usuarioforms.module.css';
import { FaUserPlus } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineMail } from "react-icons/ai";
import { AiOutlineLock } from "react-icons/ai";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import axios from 'axios';

class UsuarioForms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matricula: '',
            nome: '',
            email: '',
            senha: '',
            tipo_contrato: '',
            tipo_usuario: '',
            id_squad: '',
        };


    }

    handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            ...this.state,
            matricula: parseInt(this.state.matricula),
            id_squad: parseInt(this.state.id_squad)
        };
        axios.post('http://localhost:3001/usuario', formData)
            .then(response => {
                console.log(response.data);
                // fazer algo com a resposta do servidor aq
                // se resposta for 201, alerta de sucesso
                // se resposta for 400, alerta de erro
                if (response.data.statusCode === 201) {
                    alert('Usuário cadastrado com sucesso!');
                }
            })
            .catch(error => {
                console.log(error);
                // lidar com erros aqui
                alert('Erro ao cadastrar usuário!');
            });
    }


    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <div className={styles.box}>
                <div className={styles.box2}>
                    <form onSubmit={this.handleSubmit}>
                        <div className={styles.box3}>
                            <label>
                                <AiOutlineUser
                                    size={30}
                                />
                                <input
                                    type="number"
                                    placeholder="Matrícula"
                                    name="matricula"
                                    value={this.state.matricula}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label>
                                <AiOutlineUser
                                    size={30}
                                />
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    name='nome'
                                    value={this.state.nome}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label>
                                <AiOutlineMail
                                    size={30}
                                />
                                <input
                                    type="text"
                                    placeholder="E-mail"
                                    name='email'
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label>
                                <AiOutlineLock
                                    size={30}
                                />
                                <input
                                    type="text"
                                    placeholder="Senha"
                                    name='senha'
                                    value={this.state.senha}
                                    onChange={this.handleChange}

                                />
                            </label>
                            <label>
                                <AiOutlineUsergroupAdd size={30} />
                                <select
                                    name='tipo_contrato'
                                    value={this.state.tipo_contrato}
                                    onChange={this.handleChange}
                                >
                                    <option value="">Selecione o Tipo de Contrato</option>
                                    <option value="CLT">CLT</option>
                                    <option value="PJ">PJ</option>
                                </select>
                            </label>
                            <label>
                                <AiOutlineUsergroupAdd
                                    size={30}
                                />
                                <select
                                    name='tipo_usuario'
                                    placeholder='Tipo de Usuário'
                                    value={this.state.tipo_usuario}
                                    onChange={this.handleChange}
                                    >
                                    <option value="">Selecione o Tipo de Usuário</option>
                                    <option value="GESTOR">Gestor</option>
                                    <option value="COLABORADOR">Colaborador</option>
                                </select>
                            </label>
                            <label>
                                <AiOutlineUsergroupAdd
                                    size={30}
                                />
                                <input type="number"
                                    placeholder="ID da Squad"
                                    name='id_squad'
                                    value={this.state.id_squad}
                                    onChange={this.handleChange}
                                />
                            </label>
                        </div>
                        <div className={styles.box4}>
                            <button type="submit">
                                <FaUserPlus
                                    size={30}
                                />
                                Cadastrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default UsuarioForms;