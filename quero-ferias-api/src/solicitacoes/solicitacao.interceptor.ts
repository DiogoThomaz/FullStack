import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Notify } from '../notificacao/notify/notify.service';
import { Solicitacoes } from './entities/solicitacoes.entity';

//*** INTERCEPTA A SOLICITAÇÃO ***//
// para notificar externamente o usuários

@Injectable()
export class SolicitacaoInterceptor implements NestInterceptor {

  constructor(

    @Inject(Notify)
    private notify: Notify

  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async (response) => {

        console.log(response)
        if(response.estado == 'APROVADO') {
          this.notify.solicitacaoAprovada(response.id_colaborador.id, response.id_gestor.id, response.ferias_inicio, response.ferias_fim)
        }
        if(response.estado == 'REPROVADA') {
          this.notify.solicitacaoReprovada(response.id_colaborador.id, response.id_gestor.id, response.ferias_inicio, response.ferias_fim, response.comentario_gestor)
        }
        if(response.estado == 'PENDENTE') {
          console.log(response)
          this.notify.solicitacaoPendente(response.id_colaborador, response.id_gestor)
        }
      }),
    );
  }
}
