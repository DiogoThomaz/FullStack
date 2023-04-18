import { Module } from '@nestjs/common';
import { NotificacaoService } from './notificacao.service';
import { NotificacaoController } from './notificacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacao } from './entities/notificacao.entity';
import { Usuarios } from 'src/usuario/entities/usuario.entity';
import { Solicitacoes } from 'src/solicitacoes/entities/solicitacoes.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { Notify } from './notify/notify.service'
import { NotifyEmail } from './notify/notify-email.service';
import { NotifySystem } from './notify/notifiy-system.service';
import { NotifyWorkplace } from './notify/notify-workplace.service';
import NotifyCalendarGoogle from './notify/notify-calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notificacao, Usuarios, Solicitacoes]),
    UsuarioModule
    ],
  controllers: [NotificacaoController],
  providers: [NotificacaoService, Notify, NotifyEmail, NotifySystem, NotifyWorkplace, NotifyCalendarGoogle],
  exports: [NotificacaoService, Notify, NotifyEmail, NotifySystem, NotifyWorkplace, NotifyCalendarGoogle]
})
export class NotificacaoModule {}
