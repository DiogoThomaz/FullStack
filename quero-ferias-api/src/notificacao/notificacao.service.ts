import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitacoes } from 'src/solicitacoes/entities/solicitacoes.entity';
import { Usuarios } from 'src/usuario/entities/usuario.entity';
import { Repository } from 'typeorm';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from './dto/update-notificacao.dto';
import { Notificacao } from './entities/notificacao.entity';
import axios from 'axios'
import { SendExternalDto } from './dto/send-external.dto';
import { UsuarioService } from 'src/usuario/usuario.service';


@Injectable()
export class NotificacaoService {
  constructor(
    @InjectRepository(Notificacao)
    private notificacaoRepository: Repository<Notificacao>,

    @InjectRepository(Usuarios)
    private usuarioRepository: Repository<Usuarios>,

    @InjectRepository(Solicitacoes)
    public solicitacoesRepository: Repository<Solicitacoes>,

    @Inject(UsuarioService)
    private usuariosService: UsuarioService

  ) { }

  create(createNotificacaoDto: CreateNotificacaoDto) {
    
    // data no formato yyyy-mm-dd
    const data_criacao = new Date();
    const data_hora = data_criacao.toISOString().slice(0, 10);
    createNotificacaoDto.data_hora = data_hora;
  
    // seta a notificação como não lida
    createNotificacaoDto.lida = false;
    
    return this.notificacaoRepository.save(createNotificacaoDto);
  }

  findAll() {
    return this.notificacaoRepository.find();
  }

  findOne(id: string) {
    return this.notificacaoRepository.findOneBy({ id : id});
  }

  async update(id: string, updateNotificacaoDto: UpdateNotificacaoDto) {
    const notificacao = await this.notificacaoRepository.preload({
      id: id,
      ...updateNotificacaoDto
    })
    if(!notificacao){
      throw new Error('Notificacao não encontrada')
    }
    return this.notificacaoRepository.save(notificacao);

  }

  remove(id: string) {
    return this.notificacaoRepository.delete(id);
  }

  // cria uma notificação para o usuario
  async createNotificacaoUsuario(id: string, mensagem: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id: id });
    const notificacao = new Notificacao();
    notificacao.id_usuario = usuario.id;
    notificacao.mensagem = mensagem;
    notificacao.data_hora = new Date().toISOString().slice(0, 10);
    notificacao.lida = false;
    return this.notificacaoRepository.save(notificacao);
  }

  //*** SERVIÇO PARA ENCONTRAR O GESTOR E USUARIO PELO ID DA SOLICITAÇÃO ***//
  async findGestorColaborador(idSolicitacao: string): Promise<Solicitacoes> {
    const solicitacao = await this.solicitacoesRepository.findOneBy({id: idSolicitacao});
    return solicitacao;
  }

  //*** SERVIÇO DE EMAIL PADRÃO ***//
  async sendEmail(id:string, mensagem: string, anexo: string, assunto: string) {
    try {
      const usuario = await this.usuariosService.findMyProfile(id)
      const email = usuario.gmail
      await axios.post(`http://localhost:8000/email/enviar`, {
      "mensagem": `${mensagem}`,
      "destinatario": "diogommtdes@gmail.com",
      "assunto": `${assunto}`,
      "anexo": `${anexo}`
  })
    }
    catch(error) {
      console.log(error.message);
      return error.message;
    }
    
  }

  //*** SERVIÇO WORKPLACE MENSAGEM ***//
  async sendWorkplaceMessage(mensagem: string) {
    try {
      console.log(mensagem)
      await axios.post(`http://localhost:8000/workplace/enviar`, 
        {mensagem: `${mensagem}`}
      )
    }
    catch(error) {
      console.log(error.message);
      return error.message;
    }
  }

  //*** SERVIÇO ENVIAR EMAIL PARA O COLABORADOR (notificacoes-api) ***//
  async sendEmailToColaborador(sendExternalDto: SendExternalDto) {
    
    // tenta notificar o colaborador
    try {
        const response = await axios.post('http://localhost:8000/email/notificar-colaborador', sendExternalDto);
        return response.data;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
  }

  //*** SERVIÇO ENVIAR EMAIL PARA O GESTOR (notificacoes-api) ***//
  async sendEmailToGestor(sendExternalDto: SendExternalDto) {
      
      // tenta notificar o gestor
      try {
          const response = await axios.post('http://localhost:8000/email/notificar-gestor', sendExternalDto);
          return response.data;
      } catch (error) {
          console.log(error.message);
          return error.message;
      }
    }

    //*** NOTIFICA 11M SEM FÉRIAS ***//
    async notificaOnzeMeses(data: any) {
      console.log("data: ", data)
      try {
        const usuario = await this.usuariosService.findMyProfile(data.id_colaborador)
        const email = {
          "mensagem": `${usuario.nome}, fazem ${data.ultima_ferias} meses que você não tira férias. Por favor, solicite suas férias o mais rápido possível.`,
          "destinatario": "diogommtdes@gmail.com",
          "assunto": `Férias atrasadas - ${usuario.nome}`,
          "anexo": "nao"
      }
        await axios.post("http://localhost:8000/email/enviar", email)
          .then(response => {
            return {
              message: "usuário notificado com sucesso",
              response: response
            }
          })

        await axios.post("http://localhost:8000/workplace/enviar", {"mensagem": `${email.mensagem}`})
      }

      
      catch (error) {
        return {
          error: error,
          message: "não foi possível notificar o usuário"
        }
      }
    }

    //*** NOTIFICA 2ANOS SEM FÉRIAS ***//
    async notificaDoisAnos(data: any) {
      try {
        // notifica o colaborador
        const usuario = await this.usuariosService.findMyProfile(data.id_colaborador)
        const gestor = await this.usuariosService.findMyGestor(data.id_colaborador)
        const email = {
          "mensagem": `${usuario.nome}, fazem ${data.ultima_ferias} meses que você não tira férias. Por favor, solicite suas férias o mais rápido possível.`,
          "destinatario": "diogommtdes@gmail.com",
          "assunto": `Férias atrasadas - ${usuario.nome}`,
          "anexo": "nao" }
        await axios.post("http://localhost:8000/email/enviar", email)
          .then(response => {
            return {
              message: "usuário notificado com sucesso",
              response: response
            }
          })
        await axios.post("http://localhost:8000/workplace/enviar",{ "mensagem": `${email.mensagem}`})

        // notifica o gestor
        const emailGestor = {
          "mensagem": `${gestor.nome}, esse assunto precisa da sua atenção. O(a) ${usuario.nome} não tira férias há ${data.ultima_ferias} meses. Por favor, resolva este assunto o mais rápido possível para que o colaborador(a) possa tirar suas férias.`,
          "destinatario": "diogommtdes@gmail.com",
          "assunto": `O(A) ${usuario.nome} precisa de férias`,
          "anexo": "nao"}
        await axios.post("http://localhost:8000/email/enviar", emailGestor)
          .then(response => {
            return {
              message: "gestor notificado com sucesso",
              response: response
            }
          })
        await axios.post("http://localhost:8000/workplace/enviar", {"mensagem": `${emailGestor.mensagem}`})
        }
      catch (error) {
        return {
          error: error,
          message: "não foi possível notificar o usuário"
        }
      }

    }

    //*** SERVIÇO PARA ENCONTRAR NOTIFICAÇÕES PELO ID DO USUARIO ***//
    async findNotificacoesHome(id: string) {
      try {
        const usuario = await this.usuariosService.findOne(id)
        const notificacoes = await this.notificacaoRepository.createQueryBuilder('notificacoes')
          .select('notificacoes.id')
          .addSelect('notificacoes.id_usuario')
          .addSelect('notificacoes.data_hora')
          .addSelect('notificacoes.mensagem')
          .addSelect('notificacoes.lida')
          .where('notificacoes.id_usuario = :id', { id: usuario.id })
          .orderBy('notificacoes.data_hora', 'DESC')
          .getMany()
        return notificacoes
      } catch (error) {
        throw new BadRequestException('Something bad happened', { cause: new Error(), description: error.message })
      }
    }

}

