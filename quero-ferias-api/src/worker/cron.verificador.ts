import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificacaoModule } from 'src/notificacao/notificacao.module';
import { NotificacaoService } from 'src/notificacao/notificacao.service';
import { SolicitacoesService } from 'src/solicitacoes/solicitacoes.service';
import { UsuarioService } from 'src/usuario/usuario.service';
/*
 RESPONSABILIDADE:
  1. Identificar o colaborador com férias vencidas (11m ou 2a) 
  2. Identificar o tempo desde de sua última férias
  3. Repassar informações para serviço de notificação
*/
@Injectable()
export class CronVerificador {
    constructor(
        @Inject(SolicitacoesService)
        private solicitacoesService: SolicitacoesService,

        @Inject(UsuarioService)
        private usuarioService: UsuarioService,

        @Inject(NotificacaoService)
        private notificacoesService: NotificacaoService
    ){}
  private readonly logger = new Logger(CronVerificador.name);

  //@Cron(CronExpression.EVERY_5_MINUTES) // <-- teste
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.debug('Verificando férias vencidas');
    const todosUsuarios = await this.usuarioService.usuariosAtivos()
    console.log("todosUsuarios", todosUsuarios)
    const arrUsuariosId = todosUsuarios.map(usuarios => usuarios.id)
    console.log("arrUsuariosId", arrUsuariosId)
    await arrUsuariosId.forEach(async id => {
      console.log("id", id)
      
        const solicitacoes = await this.solicitacoesService.ultimaFerias(id);
        console.log("solicitacoes", solicitacoes)
        const vencida = await this.solicitacoesService.verificaVencimento(solicitacoes)
        console.log("vencida", vencida)
        if(vencida.status === 'VENCIDA') {

          if(vencida.ultima_ferias >= 22){
            console.log('Não pode acumular 2 períodos aquisitivos')
            console.log({id_colaborador: id, status: vencida.status, ultima_ferias: vencida.ultima_ferias})
            const data = {
              id_colaborador: id,
              status: vencida.status,
              ultima_ferias: vencida.ultima_ferias,
            }
            console.log("notificando...")
            const notificacao = await this.notificacoesService.notificaDoisAnos(data)
            return 
          }

          if(vencida.ultima_ferias >= 11) {
            console.log('Férias próximo de vencer')
            console.log({id_colaborador: id, status: vencida.status, ultima_ferias: vencida.ultima_ferias})
            const data = {
              id_colaborador: id,
              status: vencida.status,
              ultima_ferias: vencida.ultima_ferias,
            }
            console.log("notificando...")
            const notificacao = await this.notificacoesService.notificaOnzeMeses(data)
            return 
          }
        }
        console.log("Não vencida")
        return
        
    })
    // 
    }
}
    