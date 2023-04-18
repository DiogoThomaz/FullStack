import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { SignInDto } from './dto/sign-in-usuario.dto';
import { Usuarios } from './entities/usuario.entity';
import { Squad } from './../squad/entities/squad.entity';
import { AuthService } from 'src/auth/auth/auth.service';
import { Solicitacoes } from 'src/solicitacoes/entities/solicitacoes.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuarios)
    private usuarioRepository: Repository<Usuarios>,

    @InjectRepository(Squad)
    private squadRepository: Repository<Squad>,

    @InjectRepository(Solicitacoes)
    private solicitacoesRepository: Repository<Solicitacoes>,

    private readonly authService: AuthService,
  ) { }


  public async signup(signupDto: CreateUsuarioDto): Promise<Usuarios> {
    const senha = await bcrypt.hash(signupDto.senha, 10);
    const novoUsuario = this.usuarioRepository.create({ ...signupDto, senha });
    const user = await this.usuarioRepository.save(novoUsuario);
    return user
  }

  public async signin(
    signInDto: SignInDto,
  ): Promise<{ nome: string; jwtToken: string; email: string; tipo_usuario: string; usuario: Usuarios; squads?: any  }> {
    const user = await this.findByEmail(signInDto.email);
    const match = await this.checkPassword(signInDto.senha, user);

    if (!match) {
      throw new NotFoundException('Invalid credentials.');
    }
    
    if(user.tipo_usuario === 'GESTOR') {
      var squads = await this.squadRepository.findBy({id_gestor: user.id});
    }
    const jwtToken = await this.authService.createAccessToken((user.id).toString());

    return { nome: user.nome, jwtToken, email: user.email, tipo_usuario: user.tipo_usuario, usuario: user, squads: squads };
  }


  create(createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioRepository.save(createUsuarioDto);
  }


  findAll(): Promise<Usuarios[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: string) {
    return await this.usuarioRepository.findOneBy({ id: id });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    
    // verifica se usuário existe
    const usuario = await this.usuarioRepository.preload({
      id: id,
      ...updateUsuarioDto,
    })
    if (!usuario) {
      throw new NotFoundException(`Usuário de id:${id}, não foi encontrado!`)
    }

    return this.usuarioRepository.save(usuario)
  }

  async remove(id: string) {
    try {
      console.log(id)
    const usuario = await this.usuarioRepository.findOneBy({ id: id })
    if (!usuario) {
      throw new NotFoundException(`Usuário de id:${id}, não foi encontrado!`)
    }

    return await this.usuarioRepository.remove(usuario)
  }
  catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
  }

  //*** SERVIÇO PARA ENCONTRAR O GESTOR DO COLABORADOR ***//
  async findMyGestor(id: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id: id })
    if (!usuario) {
      throw new NotFoundException(`Usuário de id:${id}, não foi encontrado!`)
    }
    
    const squad = await this.squadRepository.findOneBy({ id: usuario.id_squad })
    const gestor = await this.usuarioRepository.findOneBy({ id: squad.id_gestor })

    return {
      nome: gestor.nome,
      email: gestor.gmail,
      id_gestor: gestor.id
    }
  }

  // encontra todos os colaboradores que pertecem a uma squad do gestor
  async findColaboradoresByGestorId(id: string) {
    // busca usuário
    const gestor = await this.usuarioRepository.findOneBy({id: id})
    // verifica se ele é gestor
      //....
    // pega o id do gestor
    const idGestor = gestor.id
    // verfica de qual squad ele é gestor
    const squads = await this.squadRepository.findBy({id_gestor: idGestor});
    // pega todos os colaborades da squad
    const colaboradores = await this.usuarioRepository.createQueryBuilder('usuarios')
      .select(['usuarios.id','usuarios.nome', 'usuarios.email', 'usuarios.id_squad', 'usuarios.cargo', 'usuarios.data_contratacao'])
      .where('usuarios.id_squad IN (:...ids)', { ids: squads.map(squad => squad.id) })
      .getMany();
    
    const dataSend = colaboradores.map(colaborador => {
      return {
        avatar: colaborador.nome[0],
        id: colaborador.id,
        nome: colaborador.nome,
        email: colaborador.email,
        cargo: colaborador.cargo,
        data_contratacao: colaborador.data_contratacao.toISOString().slice(0,10).split('-').reverse().join('/'),
        id_squad: colaborador.id_squad,
      }
    })

    return dataSend
  }

  async findMyProfile(id: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id: id })
    if (!usuario) {
      throw new NotFoundException(`Usuário de id:${id}, não foi encontrado!`)
    }
    return {
      nome: usuario.nome,
      email: usuario.email,
      gmail: usuario.gmail,
      cargo: usuario.cargo,
      data_contratacao: usuario.data_contratacao,
      id_squad: usuario.id_squad,
    }
  }

  // ---- metodos privados ----

  private async findByEmail(email: string): Promise<Usuarios> {
    const user = await this.usuarioRepository.findOne({ where: { email: email } })
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user
  }

  private async checkPassword(password: string, user: Usuarios): Promise<boolean> {
    const match = await bcrypt.compare(password, user.senha);
    return match;
  }

    
  // encontra todos os colaboradores que também são da mesma squad.
  async findColaboradoresByColaboradorId(id: string) {
    const colaborador = await this.usuarioRepository.findOneBy({ id: id })
    if (!colaborador) {
      throw new NotFoundException(`Colaborador de id:${id}, não foi encontrado!`)
    }

    // query para retornar todos os nomes dos colaboradores que pertencem a mesma squad
    const colaboradores = await this.usuarioRepository.find({
      where: { id_squad: colaborador.id_squad }
    })
    
    const ids = colaboradores.map(colaborador => colaborador.id)
    const nomes = colaboradores.map(colaborador => colaborador.nome)
    const emails = colaboradores.map(colaborador => colaborador.email)

    // retorna um array de objetos com os nomes e emails dos colaboradores
    const listaDeColaboradores = nomes.map((nome, index) => {
      return {
        id: ids[index],
        nome: nome,
        email: emails[index]
      }
    })

    return {
      squad: listaDeColaboradores
    }
  }

  async usuariosAtivos() {
    const usuariosAtivos = await this.usuarioRepository.createQueryBuilder('usuarios')
      .select('usuarios.id')
      .where('usuarios.ativo = :ativo', { ativo: true })
      .getMany();

    return usuariosAtivos
  }

 
  



}
