import { Module } from '@nestjs/common';
import { SolicitacoesService } from './solicitacoes.service';
import { SolicitacoesController } from './solicitacoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitacoes } from './entities/solicitacoes.entity';
import { Usuarios } from 'src/usuario/entities/usuario.entity';
import { Squad } from 'src/squad/entities/squad.entity';
import { NotificacaoModule } from 'src/notificacao/notificacao.module';
import { SolicitacaoInterceptor } from './solicitacao.interceptor';
import { UsuarioModule } from 'src/usuario/usuario.module';




@Module({
  imports: [
    TypeOrmModule.forFeature([Solicitacoes, Usuarios, Squad]),
    NotificacaoModule,
    UsuarioModule,
  ],
  controllers: [SolicitacoesController],
  providers: [
    SolicitacoesService, 
    SolicitacaoInterceptor,
    ],
  exports: [SolicitacoesService]
})
export class SolicitacoesModule {}
