import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { NotificacaoService } from './notificacao.service';
import { CreateNotificacaoDto } from './dto/create-notificacao.dto';
import { UpdateNotificacaoDto } from './dto/update-notificacao.dto';
import { SendExternalDto } from './dto/send-external.dto';

@Controller('notificacao')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Post()
  create(@Body() createNotificacaoDto: CreateNotificacaoDto) {
    try {
      return this.notificacaoService.create(createNotificacaoDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.notificacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificacaoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificacaoDto: UpdateNotificacaoDto) {
    return this.notificacaoService.update(id, updateNotificacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificacaoService.remove(id);
  }

  @Post('/externa')
  sendEmailToColaborador(@Body() sendExternalDto: SendExternalDto) {
    try {
      return this.notificacaoService.sendEmailToColaborador(sendExternalDto)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/minhas/:id')
  getMyNotifications(@Param('id') id: string) {
    try {
      return this.notificacaoService.findNotificacoesHome(id)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
