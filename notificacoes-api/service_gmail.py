import smtplib
import email.message
import os
from dotenv import load_dotenv
load_dotenv()

## classe email
class Email:
    def __init__(self, mensagem, destinatario, assunto, anexo):
        self.mensagem = mensagem
        self.destinatario = destinatario
        self.assunto = assunto
        self.anexo = anexo
    
    def enviar_email(self):
        msg = email.message.Message()               
        msg['Subject'] = self.assunto
        msg['From'] = os.environ['EMAIL']
        msg['To'] = self.destinatario
        password = os.environ['SENHA']

        msg.add_header('Content-Type', 'text/html')   
        msg.set_payload(self.mensagem)                

        s = smtplib.SMTP('smtp.gmail.com: 587')
        s.starttls()                                  
        s.login(msg['From'], password)

        try:
            s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8')) 
            print('Email enviado')
        except:
            print(self.anexo, self.assunto, self.destinatario, self.mensagem)
            print('Erro ao enviar email')


