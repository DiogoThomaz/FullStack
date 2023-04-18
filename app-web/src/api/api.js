// api para fazer requisições ao servidor
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001',
});

// cria classe API
class API {
    // requisição de login
    async login(email, password) {
        try {
            const response = await api.post('/login', { email, password });
            return response.data;
        }
        catch (error) {
            window.alert('Erro ao fazer login');
            return null;
        }

    // requisição de cadastro de colaborador


    // requisição de cadastro de gestor

    // requisição de solicitação de férias

    // requisição de aprovação de férias

    // requisição de recusa de férias

    // requisição de consulta de férias

    
}

}

export default API
