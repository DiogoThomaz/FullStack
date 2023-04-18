import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateSolicitacoeDto } from './dto/create-solicitacoe.dto';
import { UpdateSolicitacoeDto } from './dto/update-solicitacoe.dto';
import { In, LessThan, MetadataAlreadyExistsError, QueryBuilder, Raw, Repository } from 'typeorm';
import { Solicitacoes } from './entities/solicitacoes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuarios } from 'src/usuario/entities/usuario.entity';
import { Squad } from './../squad/entities/squad.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import axios from 'axios'
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Between, FindOperator } from 'typeorm';
import { startOfYear, endOfYear, toDate } from 'date-fns';




@Injectable()
export class SolicitacoesService {

  constructor(
    @InjectRepository(Solicitacoes)
    private solicitacoesRepository: Repository<Solicitacoes>,

    @InjectRepository(Usuarios)
    private  usuariosRepository: Repository<Usuarios>,

    @InjectRepository(Squad)
    private squadRepository: Repository<Squad>,

    @Inject(UsuarioService)
    private usuarioService: UsuarioService,
  ) {}

  // *** SERVIÇO PARA CRIAR UMA SOLICITAÇÃO ***//
  async create(createSolicitacoeDto: CreateSolicitacoeDto) {
    // Verifica se o colaborador já possui uma solicitação pendente
    const solicitacoesPendentes = await this.solicitacoesRepository.createQueryBuilder('solicitacoes')
      .select('solicitacoes.id')
      .where('solicitacoes.id_colaborador = :id_colaborador', { id_colaborador: createSolicitacoeDto.id_colaborador })
      .andWhere('solicitacoes.estado = :estado', { estado: 'PENDENTE' })
      .getOne();
     if (solicitacoesPendentes) {
       throw new UnprocessableEntityException(`Já existe uma solicitação pendente para o colaborador de id ${createSolicitacoeDto.id_colaborador}`);
     }

    const usuario = await this.usuariosRepository.findOneBy({id : createSolicitacoeDto.id_colaborador})
    const squad_usuario = await this.squadRepository.findOneBy({id: usuario.id_squad})
    if(!squad_usuario || usuario.id_squad !== squad_usuario.id && usuario.tipo_usuario !== 'GESTOR') {
      throw new UnauthorizedException('O usuário não pertence a squad')
    }

    if(usuario.tipo_usuario == 'COLABORADOR') {
      createSolicitacoeDto.id_gestor = squad_usuario.id_gestor
    }
    if(usuario.tipo_usuario == 'GESTOR') {
      createSolicitacoeDto.id_gestor = usuario.id
    }

    const dias = (new Date(createSolicitacoeDto.ferias_fim).getTime() - new Date(createSolicitacoeDto.ferias_inicio).getTime()) / (1000 * 3600 * 24);
    const permitido = await this.podeTirarFerias(createSolicitacoeDto.id_colaborador, dias);
    if(permitido.podeTirar === false) {
      const mensagem = "Verifique seu saldo de férias. Você deve tirar no mínimo 15 dias de férias por ano."
      throw new UnprocessableEntityException(mensagem)
    }
    
    createSolicitacoeDto.data_abertura = new Date().toISOString().slice(0, 10);
    createSolicitacoeDto.estado = 'PENDENTE';

    if(usuario.tipo_contrato === 'PJ'&& createSolicitacoeDto.decimo_terceiro === true) {
      throw new UnprocessableEntityException('Somente funcionários CLT podem pedir adiantamento de décimo terceiro')
    }
    
    if(usuario.tipo_contrato === 'CLT' && createSolicitacoeDto.decimo_terceiro === null ) {
      createSolicitacoeDto.decimo_terceiro = false
    }

    return await this.solicitacoesRepository.save(createSolicitacoeDto);
  }

  //*** SERVIÇO PARA ENCONTRAR TODAS AS SOLICITAÇÕES ***//
  async findAll() {
    return await this.solicitacoesRepository.find();
  }

  //*** SERVIÇO PARA ENCONTRAR UMA SOLICITAÇÃO PELO ID ***/
  async findOne(id: string) {
    return await this.solicitacoesRepository.findOneBy({ id: id });
  }

  //*** SERVIÇO PARA APROVAR OU RECUSAR SOLICITAÇÃO ****//
  async update(id: string, updateSolicitacoeDto: UpdateSolicitacoeDto): Promise<Solicitacoes> {
    // encontra os dados da solicitação pelo id
    updateSolicitacoeDto.data_conclusao = new Date().toISOString().slice(0, 10);
    const solicitacao = await this.solicitacoesRepository.preload({ 
      id: id,
      ...updateSolicitacoeDto
    });
    // se não existir a solicitação retorna erro
    if (!solicitacao) {
      throw new UnprocessableEntityException(`Solicitação de id ${id} não encontrada`);
    }
    // insere a data de conclusão da solicitação
    await this.solicitacoesRepository.save(solicitacao);
    const novaSolicitacao = await this.solicitacoesRepository.createQueryBuilder('solicitacoes')
    .select(['solicitacoes', 'usuarios.id', 'gestores.id'])
    .leftJoin('solicitacoes.id_colaborador', 'usuarios')
    .leftJoin('solicitacoes.id_gestor', 'gestores')
    .where('solicitacoes.id = :id', { id: id })
    .getOne();

    return novaSolicitacao;
  }

  //*** SERVIÇO PARA EXCLUIR UMA SOLICITAÇÃO ***//
  async remove(id: string) {
    const solicitacao = await this.solicitacoesRepository.findOneBy({ id: id });
    if (!solicitacao) {
      throw new UnprocessableEntityException(`Solicitação de id ${id} não encontrada`);
    }
    return await this.solicitacoesRepository.delete(id);
  }

  //*** SOLICITAÇÕES PENDENTES POR ID DO GESTOR *** //
  async findAllSolicitacoesPendentesByGestor(id: string) {
      // encontra o usuário
    const usuario = await this.usuariosRepository.findOneBy({id: id})
      // verifica se ele é gestor
    if(usuario.tipo_usuario !== 'GESTOR') {
      throw new UnprocessableEntityException(`${usuario.nome}, não é gestor`)
    }
      // verifica a squad que ele comanda
    const squad = this.squadRepository.createQueryBuilder('squads')
      .select('squads.id')
      .where('squads.id_gestor = :id', { id: id })
      .getOne()
      // verifica as solicitações
        // pega as que estão pendentes
    const solicitacoesPendentes = await this.solicitacoesRepository.createQueryBuilder('solicitacoes')
      .select('solicitacoes.id')
      .addSelect('solicitacoes.data_abertura')
      .addSelect('solicitacoes.comentario_colaborador')
      .addSelect('solicitacoes.estado')
      .addSelect('solicitacoes.id_colaborador')
      .addSelect('solicitacoes.ferias_inicio')
      .addSelect('solicitacoes.ferias_fim')
      .addSelect('solicitacoes.decimo_terceiro')
      .addSelect('usuarios.nome')
      .innerJoin('solicitacoes.id_colaborador', 'usuarios')
      .where('solicitacoes.id_gestor = :id', { id: id })
      .andWhere('solicitacoes.estado = :estado', { estado: 'PENDENTE' })
      .getMany()
      // verifica se há solicitações pendentes
    if(!solicitacoesPendentes || solicitacoesPendentes.length === 0) {
      throw new UnprocessableEntityException(`Não há solicitações pendentes para a squad do gestor de id ${id}`)
    }
      // trata os dados para enviar
    const solicitacoesDataResponse = solicitacoesPendentes.map(solicitacao => {
      const data = {
        id: solicitacao.id,
        data_abertura: solicitacao.data_abertura,
        comentario_colaborador: solicitacao.comentario_colaborador,
        estado: solicitacao.estado,
        ferias_inicio: solicitacao.ferias_inicio,
        ferias_fim: solicitacao.ferias_fim,
        colaborador: solicitacao.id_colaborador
      }
      return data
    })


      return {
        solicitacoes: solicitacoesDataResponse,
        total: solicitacoesPendentes.length
      }
  }


  //*** SOLICITAÇÕES APROVADAS PARA O GESTOR PELO ID  ***/
  async findAllSolicitacoesAprovadasByGestor(id: string) {
    const usuario = await this.usuariosRepository.findOneBy({id:id})

    if (usuario.tipo_usuario !== 'GESTOR') {
      throw new UnprocessableEntityException(`Usuário de id ${id} não é um gestor ${usuario}`);
    }

    const solicitacoes = await this.solicitacoesRepository.createQueryBuilder('solicitacoes')
      .select('solicitacoes.id')
      .addSelect('solicitacoes.data_abertura')
      .addSelect('solicitacoes.data_conclusao')
      .addSelect('solicitacoes.comentario_colaborador')
      .addSelect('solicitacoes.comentario_gestor')
      .addSelect('solicitacoes.estado')
      .addSelect('solicitacoes.ferias_inicio')
      .addSelect('solicitacoes.ferias_fim')
      .addSelect('solicitacoes.decimo_terceiro')
      .addSelect('usuarios.nome')
      .innerJoin('solicitacoes.id_colaborador', 'usuarios')
      .where('solicitacoes.id_gestor = :id', { id: id })
      .andWhere('solicitacoes.estado = :estado', { estado: 'APROVADO' })
      .getRawMany();

    const totalSolicitacoes = solicitacoes.length;
    if (totalSolicitacoes === 0) {
      throw new UnprocessableEntityException(`não há solicitações aprovadas para o gestor de id ${id}`);
    }

    return {
      total: totalSolicitacoes,
      tabela: solicitacoes,
    };
  }


  //*** SOLICITAÇÕES REPROVADAS PARA O GESTOR PELO ID  ***/
  async findAllSolicitacoesReprovadasByGestor(id: string) {
    const usuario = await this.usuariosRepository.findOneBy({id:id})

    if (usuario.tipo_usuario !== 'GESTOR') {
      throw new UnprocessableEntityException(`Usuário de id ${id} não é um gestor ${usuario}`);
    }

    const solicitacoes = await this.solicitacoesRepository.createQueryBuilder('solicitacoes')
      .select('solicitacoes.id')
      .addSelect('solicitacoes.data_abertura')
      .addSelect('solicitacoes.data_conclusao')
      .addSelect('solicitacoes.comentario_colaborador')
      .addSelect('solicitacoes.comentario_gestor')
      .addSelect('solicitacoes.estado')
      .addSelect('solicitacoes.ferias_inicio')
      .addSelect('solicitacoes.ferias_fim')
      .addSelect('solicitacoes.decimo_terceiro')
      .addSelect('usuarios.nome')
      .innerJoin('solicitacoes.id_colaborador', 'usuarios')
      .where('solicitacoes.id_gestor = :id', { id: id })
      .andWhere('solicitacoes.estado = :estado', { estado: 'REPROVADA' })
      .getRawMany();

    const totalSolicitacoes = solicitacoes.length;
    if (totalSolicitacoes === 0) {
      throw new UnprocessableEntityException(`não há solicitações recusadas para o gestor de id ${id}`);
    }

    return {
      total: totalSolicitacoes,
      tabela: solicitacoes,
    };
  }

  async podeTirarFerias(idColaborador: string, dias: number): Promise<{ podeTirar: boolean, diasDisponiveis: number }> {

    const colaborador = await this.usuariosRepository.findOneBy({ id: idColaborador });
    if (!colaborador) {
      throw new Error('Colaborador não encontrado');
    }
    
    const saldoFerias = await this.calculaSaldoDeFerias(colaborador.id);
  
    const year = new Date().getFullYear(); 
    const startDate = startOfYear(new Date(year, 0, 1)); 
    const endDate = endOfYear(new Date(year, 11, 31)); 
  
    const numFerias = await this.solicitacoesRepository.createQueryBuilder("solicitacao")
      .where("solicitacao.id_colaborador = :idColaborador", { idColaborador })
      .andWhere("solicitacao.estado = :estado", { estado: 'APROVADO' })
      .andWhere("solicitacao.ferias_inicio BETWEEN :startDate AND :endDate", { startDate, endDate })
      .getCount();
    
    const numFeriasRestantes = 3 - numFerias;
  
    if (numFeriasRestantes === 0) {
      console.log("Máximo de 3 férias por ano")
      return { podeTirar: false, diasDisponiveis: 0 };
    }
    
    const diasMinimos = 4;
    const diasMaximos = numFeriasRestantes === 3 ? 15 : 30;
    const diasRestantes = diasMaximos - dias;
  
    if (dias < diasMinimos || dias > diasMaximos || diasRestantes <= 0) {
      console.log(diasRestantes, diasMinimos, dias, numFeriasRestantes)
      return { podeTirar: false, diasDisponiveis: saldoFerias };
    }

    if (numFeriasRestantes == 3 && (dias + 1) != 15) {
      console.log('A primeira de 15d')
      console.log(numFeriasRestantes, diasMinimos, dias, numFeriasRestantes)
      return { podeTirar: false, diasDisponiveis: saldoFerias };
    }

    if(dias > saldoFerias) {
      console.log("sem saldo!")
      return { podeTirar: false, diasDisponiveis: saldoFerias };
    }
    
    return { podeTirar: true, diasDisponiveis: saldoFerias };
  }

  

  async calculaSaldoDeFerias(id: string) {
    const usuario = await this.usuariosRepository.findOneBy({id:id})
    const feriasTiradas = await this.solicitacoesRepository.createQueryBuilder('solicitacoes')
      .select('solicitacoes.id')
      .addSelect('solicitacoes.ferias_inicio')
      .addSelect('solicitacoes.ferias_fim')
      .where('solicitacoes.id_colaborador = :id', { id: id })
      .andWhere('solicitacoes.estado = :estado', { estado: 'APROVADO' })
      .getRawMany();
    
    const diasTirados = feriasTiradas.map((ferias) => {
      const dataFim = new Date(ferias.solicitacoes_ferias_fim);
      const dataInicio = new Date(ferias.solicitacoes_ferias_inicio);
      const diferenca = dataFim.getTime() - dataInicio.getTime();
      const dias = Math.ceil(diferenca / (1000 * 3600 * 24));
      return dias + 1;
    });

    const tempoDeTrabalho = new Date(usuario.data_contratacao).getFullYear() - new Date().getFullYear();
    const feriasMerecidas = tempoDeTrabalho * 30;
    const feriasSaldo = (feriasMerecidas*(-1)) - diasTirados.reduce((a, b) => a + b, 0);

    return (feriasSaldo);
  }

      //*** SERVIÇO DE DASHBOARD % SQUAD TRABALHANDO ***//
      async dashboardSquadTrabalhando(idGestor: string) {
          // todas solicitações aprovadas
        const solicitacoesAprovadas = await this.findAllSolicitacoesAprovadasByGestor(idGestor);

        // colaboradores de férias na squad (dataFim > hoje e dataInicio <= hoje)
        const colaboradoresEmFerias = solicitacoesAprovadas.tabela.filter((solicitacao) => {
          const dataFim = new Date(solicitacao.solicitacoes_ferias_fim);
          const dataInicio = new Date(solicitacao.solicitacoes_ferias_inicio);
          const dataHoje = new Date();
          return dataFim > dataHoje && dataInicio <= dataHoje;
        });
 
        const colaboradoresTrabalhando = await this.usuarioService.findColaboradoresByGestorId(idGestor);
        
        return {
          total: colaboradoresTrabalhando.length,
          trabalhando: colaboradoresTrabalhando.length - colaboradoresEmFerias.length,
          ferias: colaboradoresEmFerias.length,
        }
      }

      //*** SERVIÇO DE DASHBOARD GRAFICO FLUXO DE FÉRIAS P/ MÊS ***//
      async dashboardFluxoFeriasPorMes(idGestor: string) {
        const solicitacoesAprovadas = await this.findAllSolicitacoesAprovadasByGestor(idGestor);
        const solicitacoes = solicitacoesAprovadas.tabela;
        const dataHoje = new Date();
        const meses = [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ];
        const mesesObj = [];
        for (let i = 0; i < 6; i++) {
          const mesAtual = dataHoje.getMonth() + i;
          const mes = meses[mesAtual];
          const voltando = solicitacoes.filter((solicitacao) => {
            const dataFim = new Date(solicitacao.solicitacoes_ferias_fim);
            return dataFim.getMonth() === mesAtual;
          }).length;
          const saindo = solicitacoes.filter((solicitacao) => {
            const dataInicio = new Date(solicitacao.solicitacoes_ferias_inicio);
            return dataInicio.getMonth() === mesAtual;
          }).length;
          const diff = voltando - saindo;
          mesesObj.push({
            name: mes,
            saindo: saindo,
            voltando: voltando,
            diff: diff,
          });
        }
        return mesesObj;
      }

      //*** SERVIÇO DE DASHBOARD SAIDAS POR MES ***//
      async dashboardSaidasPorMes(idGestor: string) {
        const solicitacoesAprovadas = await this.findAllSolicitacoesAprovadasByGestor(idGestor);
        const solicitacoes = solicitacoesAprovadas.tabela;
        const dataHoje = new Date();
        const meses = [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ];
        const mesesObj = [];
        for (let i = 0; i < 6; i++) {
          const mesAtual = dataHoje.getMonth() + i;
          const mes = meses[mesAtual];
          const v = solicitacoes.filter((solicitacao) => {
            const dataInicio = new Date(solicitacao.solicitacoes_ferias_inicio);
            return dataInicio.getMonth() === mesAtual;
          });
          const nomes = v.map((solicitacao) => solicitacao.usuarios_nome);
          const dia = v.map((solicitacao) => {
            const dataFim = new Date(solicitacao.solicitacoes_ferias_fim);
            return `${dataFim.getDate()}/${dataFim.getMonth()}/${dataFim.getFullYear()}`;
          });
          mesesObj.push({
            name: mes,
            qtd: v.length,
            nomes: nomes,
            dia: dia,
          });
        }
        return mesesObj;
      }

      //*** SERVIÇO DASHBOARD LISTA DE FÉRIAS ***//
      async dashboardListaDeFerias(idGestor: string) {
        const solicitacoesAprovadas = await this.findAllSolicitacoesAprovadasByGestor(idGestor);
        const solicitacoes = solicitacoesAprovadas.tabela;
        const rows = [];
        for (let i = 0; i < solicitacoes.length; i++) {
          const dataFim = new Date(solicitacoes[i].solicitacoes_ferias_fim);
          const dataInicio = new Date(solicitacoes[i].solicitacoes_ferias_inicio);
          const dataFimFormatada = `${dataFim.getDate()}/${dataFim.getMonth() + 1}/${dataFim.getFullYear()}`;
          const dataInicioFormatada = `${dataInicio.getDate()}/${dataInicio.getMonth() + 1}/${dataInicio.getFullYear()}`;
          const feriasAprovadaEm = new Date(solicitacoes[i].solicitacoes_data_conclusao);
          const feriasAprovadaEmFormatada = `${feriasAprovadaEm.getDate()}/${feriasAprovadaEm.getMonth() + 1}/${feriasAprovadaEm.getFullYear()}`;
          const comentarioColaborador = solicitacoes[i].solicitacoes_comentario_colaborador;
          const comentarioGestor = solicitacoes[i].solicitacoes_comentario_gestor;
          rows.push({
            comentario_colaborador: comentarioColaborador,
            comentario_gestor: comentarioGestor,
            data: dataFimFormatada,
            status: 'Voltando',
            nome: solicitacoes[i].usuarios_nome,
            cargo: solicitacoes[i].usuarios_cargo,
            feriasAprovadaEm: feriasAprovadaEmFormatada,
            verSolicitacao: 'olho',
          });
          rows.push({
            comentario_colaborador: comentarioColaborador,
            comentario_gestor: comentarioGestor,
            data: dataInicioFormatada,
            status: 'Saindo',
            nome: solicitacoes[i].usuarios_nome,
            cargo: solicitacoes[i].usuarios_cargo,
            feriasAprovadaEm: feriasAprovadaEmFormatada,
            verSolicitacao: 'olho',
          });
          rows.sort((a, b) => {
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);
            return dataA.getTime() - dataB.getTime();
          });

        }
        return rows;
      }

      //*** ENVIA EMAIL COM RELATORIO ***//
      async relatorioEmailGestor(id: string) {
        const dashboard1 = await this.dashboardSquadTrabalhando(id);
        const dashboard2 = await this.dashboardFluxoFeriasPorMes(id);
        const dashboard3 = await this.dashboardSaidasPorMes(id);
        const dashboard4 = await this.dashboardListaDeFerias(id);
        const gestor = await this.usuarioService.findMyProfile(id);
        try {
            await axios.post(`http://localhost:8000/email/relatorio`,
          {
            data: {
              dashboard1: dashboard1,
              dashboard2: dashboard2,
              dashboard3: dashboard3,
              dashboard4: dashboard4,
            },
            email: gestor.gmail,
            nome: gestor.nome
          }
          )
          .then(res => {
            return res.data
          })

        }
        catch (err) {
          return err
        }
      }

      //*** VERIFICA SALDO DE FÉRIAS ***//
      async checkSaldoFerias(id: string) {
        // qtd de dias utilizados
        const feriasTiradas = await this.solicitacoesRepository.find({
          where: {
            id_colaborador: id,
            estado: 'APROVADO'
          }
        })
        const DiasUtilizados = feriasTiradas.map((ferias) => {
          const dataInicio = new Date(ferias.ferias_inicio);
          const dataFim = new Date(ferias.ferias_fim);
          const diff = Math.abs(dataFim.getTime() - dataInicio.getTime());
          const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
          return diffDays;
        })
        const totalDiasUtilizados = DiasUtilizados.reduce((a, b) => a + b, 0);

        // qtd de dias de ferias disponíveis
        const diasDisponiveis = await this.usuarioService.findMyProfile(id);
        const contratado = new Date(diasDisponiveis.data_contratacao);
        const hoje = new Date();
        const diff = Math.abs(hoje.getTime() - contratado.getTime());
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        const qtdDiasDisponiveis = Math.round(diffDays / 365) * 30;
        const saldo = qtdDiasDisponiveis - totalDiasUtilizados;
        
        return saldo;
      }

      //*** ULTIMAS FÉRIAS ***//
  public async ultimaFerias(id: string): Promise<any> {
        const todasSolicitacoes = await this.solicitacoesRepository.createQueryBuilder('solicitacoes')
          .select('solicitacoes.id_colaborador')
          .addSelect('solicitacoes.ferias_fim')
          .addSelect('solicitacoes.estado')
          .where('solicitacoes.id_colaborador = :id', { id: id })
          .andWhere('solicitacoes.estado = :estado', { estado: 'APROVADO' })
          .orderBy('solicitacoes.ferias_fim', 'DESC')
          .getRawMany();
        const ultimaFerias = todasSolicitacoes[0];

        if(!ultimaFerias) {
          const usuario = await this.usuarioService.findMyProfile(id);
          const dataContratacao = new Date(usuario.data_contratacao);
          console.log(usuario.nome, " nunca tirou férias")
          const dataContratacaoFormatada = `${dataContratacao.getDate()}/${dataContratacao.getMonth() + 1}/${dataContratacao.getFullYear()}`;
          return dataContratacaoFormatada;
        }

        const dataFim = new Date(ultimaFerias.solicitacoes_ferias_fim);
        const dataFimFormatada = `${dataFim.getDate()}/${dataFim.getMonth() + 1}/${dataFim.getFullYear()}`;
        return dataFimFormatada;
      }

  public verificaVencimento(data: string) {
        const dataFormatada = data.split('/').reverse().join('-');
        const dataFim = new Date(dataFormatada);
        const hoje = new Date();
        const diff = Math.abs(dataFim.getTime() - hoje.getTime());
        const diffMonths = Math.ceil(diff / (1000 * 3600 * 24 * 30));
        
        if(diffMonths >= 11) {
          return {
            status: 'VENCIDA',
            ultima_ferias: diffMonths,
          }
        }

        else {
          return {
            status: 'VIGENTE',
            ultima_ferias: diffMonths,
          }
        }
      }
}