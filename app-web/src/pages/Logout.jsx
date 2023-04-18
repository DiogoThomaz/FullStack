// pagina de logout

// redireciona para a pagina de login
const Logout = () => {


    localStorage.clear();
    window.location.href = '/';
    
}

export default Logout;