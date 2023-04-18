import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, BadRequestException, HttpCode, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { SignInDto } from './dto/sign-in-usuario.dto';
import { Usuarios } from './entities/usuario.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // ! ROTA ANTIGA DE CRIAÇÃO DE USUÁRIO
  // @Post()
  // create(@Body() createUsuarioDto: CreateUsuarioDto) {
  //   try {
  //     return this.usuarioService.create(createUsuarioDto);
      
  //   } catch (error) {
  //     throw new BadRequestException(error.message, { cause: new Error(), description: 'Some error description' })
  //   }
  // }

  /*
    Rota que retorna todos os usuários
  */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAll() {
    try {
      return this.usuarioService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {

      return this.usuarioService.remove(id);
    }
    catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
    finally {
      console.log('Deletado com sucesso')
    }
  }

  @Get('/gestor/:id')
  async findAllByGestorId(@Param('id') id: string) {
    try {
      return await this.usuarioService.findColaboradoresByGestorId(id)
    }
    catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /*
    NOVA ROTA
    rota de cadastro
  */
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  public async signin(
    @Body() signInDto: SignInDto,
  ): Promise<{ nome: string; jwtToken: string; email: string, tipo_usuario: string; usuario: Usuarios; squads?: any}> {
    try {
      return await this.usuarioService.signin(signInDto);
    }
    catch (error) {
      throw new HttpException( error.message , HttpStatus.BAD_REQUEST);
    }
  }

  /*
  *NOVA ROTA DE CADASTRO DE USUÁRIOS
    Rota de cadastro
  */
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() CreateUsuarioDto: CreateUsuarioDto): Promise<Usuarios> {
    try {
      return await this.usuarioService.signup(CreateUsuarioDto);
    } catch (error) {
      // lança erro e retorna mensagem de erro
      throw new HttpException( error.message , HttpStatus.BAD_REQUEST);

    }
  }

  @Get('/colegas/:id')
  async findAllBySquadId(@Param('id') id: string) {
    try {
      return await this.usuarioService.findColaboradoresByColaboradorId(id)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } 
  }

  @Get('/meu-perfil/:id')
  async findMyprofile(@Param('id') id: string) {
    try {
      return await this.usuarioService.findMyProfile(id)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
