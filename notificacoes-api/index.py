## Email Service
## Workplace Notifications Service

## Imports
import smtplib
import email.message
import os
from dotenv import load_dotenv
load_dotenv()

## Envia email com HTML
def enviar_email(destinatario):
    
    ## Corpo do email é um HTML
    corpo_email = """
    <p>Você recebeu uma solicitação de férias</p>
    <p>Verifique com seu colaborador as <strong>datas possíveis</strong></p>
    <p>Até mais</p>"""

    ## Configurações do servidor
    msg = email.message.Message()                 ## Instância da classe Message. Ela precisa de um header e um payload
    msg['Subject'] = 'Pedido#123'
    msg['From'] = 'quero.ferias.notifica@gmail.com '
    msg['To'] = f"{destinatario}"
    password = os.environ['SENHA']
    msg.add_header('Content-Type', 'text/html')   ## Header para o email ser interpretado como HTML
    msg.set_payload(corpo_email)                  ## Payload é o corpo do email

    s = smtplib.SMTP('smtp.gmail.com: 587')
    s.starttls()                                  ## Protocolo de segurança TLS
    s.login(msg['From'], password)

    ## msg.as_string() converte o objeto msg em uma string
    ## pois ele é um objeto do tipo MIME
    s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8')) 
    print('Email enviado')

## envia_email_colaborador
## parametros: data
## propriedades do data: data.solicitacao, data.email, data.nome, data.inicio, data.fim, data.comentario, data.status
def enviar_email_colaborador(data):
    ## carrega o html do email
    with open('email_colab_solicitacao.html', 'r', encoding='utf-8') as f:
        corpo_email = f.read()
    
    ## substitui as variáveis do html
    corpo_email = corpo_email.replace("{nome}", data['nome'])
    corpo_email = corpo_email.replace("{inicio}", data['inicio'])
    corpo_email = corpo_email.replace("{fim}", data['fim'])
    corpo_email = corpo_email.replace("{comentario}", data['comentario'])
    corpo_email = corpo_email.replace("{status}", data['status'])


    ## Configurações do servidor
    msg = email.message.Message()                 ## Instância da classe Message. Ela precisa de um header e um payload
    msg['Subject'] = f"Recebemos sua solicitação{data['solicitacao']} !"
    msg['From'] = 'quero.ferias.notifica@gmail.com '
    msg['To'] = f"{data['email']}"
    password = os.environ['SENHA']
    msg.add_header('Content-Type', 'text/html')   ## Header para o email ser interpretado como HTML
    msg.set_payload(corpo_email)                  ## Payload é o corpo do email

    s = smtplib.SMTP('smtp.gmail.com: 587')
    s.starttls()                                  ## Protocolo de segurança TLS
    s.login(msg['From'], password)

    ## msg.as_string() converte o objeto msg em uma string
    ## pois ele é um objeto do tipo MIME
    try:
        s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8')) 
        print('Email enviado')
    ## retorna o erro 
    except:
        print('Erro ao enviar email')

    
## envia_email_gestor
## parametros: data
## propriedades do data: data.solicitacao, data.email, data.nome, data.fim, data.comentario, data.status, data.colaborador
def enviar_email_gestor(data):
         
    ## carrega o html do email
        with open('email_gest_solicitacao.html', 'r', encoding='utf-8') as f:
            corpo_email = f.read()
        
        ## substitui as variáveis do html
        corpo_email = corpo_email.replace("{nome}", data['nome'])
        corpo_email = corpo_email.replace("{inicio}", data['inicio'])
        corpo_email = corpo_email.replace("{fim}", data['fim'])
        corpo_email = corpo_email.replace("{comentario}", data['comentario'])
        corpo_email = corpo_email.replace("{status}", data['status'])
        corpo_email = corpo_email.replace("{colaborador}", data['colaborador'])

    
        ## Configurações do servidor
        msg = email.message.Message()                 ## Instância da classe Message. Ela precisa de um header e um payload
        msg['Subject'] = f"Solicitação de férias {data['solicitacao']}"
        msg['From'] = 'quero.ferias.notifica@gmail.com'
        msg['To'] = f"{data['email']}"
        password = os.environ['SENHA']
        msg.add_header('Content-Type', 'text/html')   ## Header para o email ser interpretado como HTML
        msg.set_payload(corpo_email)                  ## Payload é o corpo do email

        s = smtplib.SMTP('smtp.gmail.com: 587')
        s.starttls()                                  ## Protocolo de segurança TLS
        s.login(msg['From'], password)

        ## msg.as_string() converte o objeto msg em uma string
        ## pois ele é um objeto do tipo MIME
        try:
            s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8')) 
            print('Email enviado')
        ## retorna o erro 
        except:
            print('Erro ao enviar email')
