# API DE SERVIÇO DE NOTIFICAÇÕES EXTERNAS

### Configurações
porta: 8000.
rotas: 
1. (post) http://localhost:8000/email/notificar-colaborador .
2. (post) http://localhost:8000/email/notificar-gestor.
serviços:
1. Notificações por email.
2. Notificações no workplace.
3. Notificações na agenda google.
4. Envio de relatório por email.


### Como usar?
Essa api, funciona como um mensageiro do sistema quero-férias para sistemas externos (gmail, workplace e calendar).

Então, sua responsabilidade é unicamente entregar a informação que lhe foi passada e responder
se foi possível ou não fazer a entrega.

### Dados que essa api precisa receber
Para a rota 2.
{
    "solicitacao": "#3234",
    "email": "diogommtdes@gmail.com",
    "nome": "Carlos",
    "inicio": "26/03/2023",
    "fim": "26/04/2023",
    "comentario": "Minhas férias estão vencidas há 4 messes",
    "status": "Pendente",
    "colaborador": "Diogo"
}

Para a rota 1.
{
    "solicitacao": "#3234",
    "email": "diogommtdes@gmail.com",
    "nome": "Diogo",
    "inicio": "26/03/2023",
    "fim": "26/04/2023",
    "comentario": "Minhas férias estão vencidas há 4 messes",
    "status": "Pendente"
}

Esses dados devem ser enviados pelo método post, com seu contéudo no body da requisição.

### Comandos
iniciar app uvicorn main:app --reload




