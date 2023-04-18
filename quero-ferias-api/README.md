# API QUERO FÉRIAS (desenvolvimento)
## 1. Guia do desenvolvimento (ignorar)
> Aqui nesse capítulo há um rascunho das principais atividades que pretendo desenvolver a aplicação quero férias.
### 1.1 Banco de dados
Esse projeto, apesar de ter um pattern de microserviços, terá um único banco de dados. Porém, terá diversas tabelas com nesse banco para permitir a mesma robustes de que uma aplicação de microserviços tem com diversos bancos de dados.

Enquanto as tabelas desse banco dados, elas serão:

> Usuário: 
id (chave primária),
matricula,
nome,
email,
senha

> Gestor:
id (chave primária),
usuario_id (chave estrangeira referenciando a tabela "usuario"),
equipe,

> Colaborador:
id (chave primária),
usuario_id (chave estrangeira referenciando a tabela "usuario"),
gestor_id (chave estrangeira referenciando a tabela "gestor"),
equipe,
tipo_contrato (pode ser "CLT" ou "PJ")

> Notificação:
id (chave primária)
usuario_id (chave estrangeira referenciando a tabela "usuario")
mensagem
lida (flag para indicar se a notificação foi lida ou não)


> Férias:
colaborador_id (chave estrangeira referenciando a tabela "colaborador"),
data_inicio,
data_fim

> Pedido:
id (chave primária),
colaborador_id (chave estrangeira referenciando a tabela "colaborador"),
tipo_pedido (pode ser "ferias" ou "decimo_terceiro"),
data (data do pedido),
valor (valor do pedido de décimo terceiro)



### 1.2 Microserviços lógicos
Essa API, possui um único microsserviço, que é o serviço maior, que é a gestão de férias dos colaboradores.

No entanto, essa aplicação possui diversos microserviços lógicos distribuidos na API, são eles: [ ] *a fazer* [x] *feito*

> Engine Login / Auth
- [x] verifica se a senha e email estão corretos 
- [ ] redireciona home
- [ ] redireciona login erro

> Engine Usuários
- [ ] verifica se já não está cadastrado
- [x] cadastra novo usuário no banco de dados
- [x] Alterar dados de usuário
- [ ] consulta pedidos da equipe


> Engine Solicitações
- [ ] pedido férias
- [x] pedido décimo terceiro
- [x] deferir pedidos (aceitar, recusar)
- [ ] verifica se colaborador pode tirar férias
- [ ] insere férias no banco de dados se solicitacão aprovada
- [ ] verfica se colaborador é CLT para pedir décimo

> Engine Dashboard
- [ ] consulta banco de dados de toda a equipe
- [ ] calcula os dados de dashboard para o gráfico

> Engine Relatório
- [ ] pegar dados da equipe
- [ ] pegar dados do dashboard
- [ ] servir arquivo CSV

> Engine Notificação
- [ ] criar evento de notificação
- [ ] notificação pedido
- [ ] notificação pedido aceito
- [ ] notificação pedido recusado


## 2. Introdução
A aplicação Web quero férias surge da necessidade do quero-quero e verd card de gerenciar seus colaboradores, pois segundo o escopo recebido na versão 1:

>Levando em consideração que os gerentes dos times precisam
atender as demandas inerentes as aplicações gerenciadas pelo seu time, é muito
importante saber quando os seus colaboradores entrarão de férias para um melhor
controle das entregas e cumprimento dos cronogramas.

Por isso, a solução de tecnologia para esse problema é:
>Neste momento, torna–se essencial elaborar um sistema para
controlar as férias dos colaboradores de cada time tendo em vista a administração das
entregas de cada time.

Sendo os requisitos do projeto na versão 1:
> *RQ001* – Cadastrar funcionário, sendo ele CLT ou PJ.
*RQ002* – Deve ser possível correlacionar os funcionários, informando quem é o seu gestor
respectivamente.
*RQ003* – O funcionário deve conseguir solicitar um agendamento de férias, com início e fim.
*RQ004* – Seguindo as leis trabalhistas vigentes, o funcionário deverá ter a possibilidade de
requerer a antecipação do 13º salário (somente para CLT).
*RQ005* – O gestor deve conseguir visualizar todas as solicitações do seu time, aprovando ou
reprovando um agendamento.
*RQ006* – O perfil do gestor deve mostrar Dashboards com o cenário de férias agendadas.
*RQ007* – O agendamento de férias somente será validado após a aprovação do gestor.
*RQ008* – O sistema deve permitir a quantidade de dias que o funcionário pretende tirar (10,
20 ou 30 dias).
*RQ009* – Sempre que um colaborador agendar suas férias para aprovação, o gestor deverá
ser notificado por e-mail.
*RQ010* – Sempre que um colaborador tiver as férias aprovadas, a aplicação deverá marcar o
compromisso na agenda do Gmail (caso o colaborador tenha conta), Registrando na agenda
um dia antes da sua saída e um dia antes do seu retorno. (PLUS).

Por esses motivos foi optado pelo desenvolvimento de uma api gateway juntamento usando o pattern de microserviços, para que o backend da aplicação não tenha problemas futuros de escala, manutenção e disponibilidade. 

Sendo assim, essa API QUERO FÉRIAS servirá para uma grande infinidade de aplicativos como: mobile, web e CRMs da empresa.

## 3. Arquitetura da aplicação
A arquitetura da aplicação foi desenvolvida de acordo com o pattern de microserviços, usando o framework NEST.JS para criar a rotas, serviços, gateway e funcionalidades necessárias para o projeto.

No que tange a camada de dados, foi utilizado nesse projeto, o banco de dados POSTGRESQL hospedado na AWS.

Enquanto ao frontend, ele será desenvolvido usando REACT.

### 3.1 Design do backend da aplicação

### 3.2 Responsabilidades
Os serviços foram distribuidos de tal forma que cada um tenha uma única finalidade. Sendo que alguns serviços são utiliazados por outros, mas com a devida precaução para que não haja sobrecarga no serviço ou uso indevido.

Autenticação:
O serviço de autenticação é exclusivamente responsável por validar se o usuário que está fazendo as requisições tem permissão para usufruir de seus serviços.

Login:
O serviço de login é unicamente responsável por verificar os dados recebidos no corpo das requisições e validar se o usuário poderá seguir no middlewares do app.

Cadastro de usuário:
O serviço de cadastro é unicamente responsável por enviar dados necessários de cadastro para o banco de dados. Assim como validar se esses dados já não existem no banco de dados, para que não haja sobreescrita de dados ou outros problemas.

Cadastro colaborador:
Esse serviço de cadastro é unicamente responsável por enviar os dados do colaborador ao banco de dados, e ver verficar se esses dados já não são existentes banco.
Também é responsável por enviar uma resposta ao client se o cadastro foi feito com sucesso ou não.


## Documentação:

### DTO
todos os dtos possuem uma um decorator de tipo de variável, para ter maior segurança nos dados.
Esses decorators estão sendo utilizados a partir do validation pipe.

### Estrutura de pastas
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   └── guards/
│       ├── jwt-auth.guard.ts
│       └── roles.guard.ts
├── ferias/
│   ├── dto/
│   │   ├── create-ferias.dto.ts
│   │   ├── update-ferias.dto.ts
│   │   └── ferias.dto.ts
│   ├── ferias.controller.ts
│   ├── ferias.module.ts
│   ├── ferias.service.ts
│   └── ferias.entity.ts
├── equipe/
│   ├── dto/
│   │   ├── create-equipe.dto.ts
│   │   ├── update-equipe.dto.ts
│   │   └── equipe.dto.ts
│   ├── equipe.controller.ts
│   ├── equipe.module.ts
│   ├── equipe.service.ts
│   └── equipe.entity.ts
├── usuario/
│   ├── dto/
│   │   ├── create-usuario.dto.ts
│   │   ├── update-usuario.dto.ts
│   │   └── usuario.dto.ts
│   ├── usuario.controller.ts
│   ├── usuario.module.ts
│   ├── usuario.service.ts
│   └── usuario.entity.ts
├── shared/
│   ├── constants/
│   │   └── roles.constant.ts
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interfaces/
│   │   ├── jwt-payload.interface.ts
│   │   └── user.interface.ts
│   └── utils/
│       ├── bcrypt.util.ts
│       └── jwt.util.ts
└── main.ts
