import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSquadDto } from './dto/create-squad.dto';
import { UpdateSquadDto } from './dto/update-squad.dto';
import { Squad } from './entities/squad.entity';
import { Usuarios } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class SquadService {

  constructor(
    @InjectRepository(Squad)
    private squadRepository: Repository<Squad>,

    @InjectRepository(Usuarios)
    private usuariosRepository: Repository<Usuarios>
  ) {}

  async create(createSquadDto: CreateSquadDto) {
    const gestor = await this.usuariosRepository.findOneBy({id: createSquadDto.id_gestor});

    if(!gestor || gestor.tipo_usuario !== 'GESTOR') {
      throw new UnprocessableEntityException(`Somente gestores podem ter equipes`)
    }  

    const squad = this.squadRepository.create(createSquadDto)
    return this.squadRepository.save(squad)
  }

  async findAll(): Promise<Squad[]> {
    return this.squadRepository.find();
  }

  async findOne(id: string): Promise<Squad> {
    const squad = await this.squadRepository.findOneBy({id: id});

    if(!squad) {
      throw new NotFoundException(`Squad de id ${id} não encontrado`);
    }

    return squad;
  }

  async update(id: string, updateSquadDto: UpdateSquadDto): Promise<Squad> {
    const squad = await this.findOne(id);

    if (updateSquadDto.id_gestor) {
      const gestor = await this.usuariosRepository.findOneBy({id: updateSquadDto.id_gestor});

      if(!gestor || gestor.tipo_usuario !== 'GESTOR') {
        throw new UnprocessableEntityException(`Somente gestores podem ter equipes`)
      }
    }

    const updatedSquad = Object.assign(squad, updateSquadDto);
    return this.squadRepository.save(updatedSquad);
  }

  async remove(id: string): Promise<void> {
    const squad = await this.findOne(id);
    await this.squadRepository.remove(squad);
  }

  // encontra de qual squad o gestor é responsável
  async findSquadByGestor(id: string): Promise<Squad> {
    const squad = await this.squadRepository.findOneBy({id_gestor: id});

    if(!squad) {
      throw new NotFoundException(`Squad de gestor de id ${id} não encontrado`);
    }

    return squad;
  }

  //*** ENCONTRA TODAS AS SQUADS DO GESTOR ***//
  async findMySquads(id: string) {
    const squads = await this.squadRepository.findBy({id_gestor: id});
    return squads
  }

  
}
