import { Module } from '@nestjs/common';
import { SquadService } from './squad.service';
import { SquadController } from './squad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Squad } from './entities/squad.entity';
import { Usuarios } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Squad, Usuarios])],
  controllers: [SquadController],
  providers: [SquadService]
})
export class SquadModule {}
