import { Controller,
   Get, 
   Post, 
   Body, 
   Patch, 
   Param, 
   Delete, 
   UseFilters, 
   NotFoundException, 
   UseInterceptors} from '@nestjs/common';
import { SolicitacoesService } from './solicitacoes.service';
import { CreateSolicitacoeDto } from './dto/create-solicitacoe.dto';
import { UpdateSolicitacoeDto } from './dto/update-solicitacoe.dto';
import { SolicitacaoInterceptor } from 'src/solicitacoes/solicitacao.interceptor';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Solicitacoes } from './entities/solicitacoes.entity';

@Controller('solicitacoes')
export class SolicitacoesController {
  constructor(private readonly solicitacoesService: SolicitacoesService) {}
  
  
 
  @Get('/pendentes/:id')
  solicitacoesPendentes(@Param('id') id: string) {
    try {
      return this.solicitacoesService.findAllSolicitacoesPendentesByGestor(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
    
  }

  @Get('/aprovadas/:id')
  solicitacoesAprovadas(@Param('id') id: string) {
    try {
      return this.solicitacoesService.findAllSolicitacoesAprovadasByGestor(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/reprovadas/:id')
  solicitacoesReprovadas(@Param('id') id: string) {
    try {
      return this.solicitacoesService.findAllSolicitacoesReprovadasByGestor(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  
  //*** ROTA PARA CRIAR SOLICITÇÃO ***//
  @UseInterceptors(SolicitacaoInterceptor)
  @Post()
  create(@Body() createSolicitacoeDto: CreateSolicitacoeDto) {
    try {
      return this.solicitacoesService.create(createSolicitacoeDto);
    }
    catch (error) {
      throw new NotFoundException(error.message, error.status);
    }
  }
  
  @Get()
  findAll() {
    return this.solicitacoesService.findAll();
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.solicitacoesService.findOne(id);
  }

  //*** ROTA PARA ACEITAR OU RECUSAR SOLICITAÇÃO ***//
  @UseInterceptors(SolicitacaoInterceptor)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSolicitacoeDto: UpdateSolicitacoeDto): Promise<Solicitacoes> {
    return this.solicitacoesService.update(id, updateSolicitacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitacoesService.remove(id);
  }

  @Get('/relatorio-ferias-d1/:id')
  async findFeriasBySolicitacao(@Param('id') id: string) {
    return await this.solicitacoesService.dashboardSquadTrabalhando(id);
  }

  @Get('/relatorio-ferias-d2/:id')
  async dashboardD2(@Param('id') id: string) {
    return await this.solicitacoesService.dashboardFluxoFeriasPorMes(id);
  }

  @Get('/relatorio-ferias-d3/:id')
  async dashboardD3(@Param('id') id: string) {
    return await this.solicitacoesService.dashboardSaidasPorMes(id);
  }

  @Get('/relatorio-ferias-d4/:id')
  async dashboardD4(@Param('id') id: string) {
    return await this.solicitacoesService.dashboardListaDeFerias(id);
  }

  @Get('/relatorio/:id')
  async enviarRelatorio(@Param('id') id: string) {
    try {
      return await this.solicitacoesService.relatorioEmailGestor(id);
    }
    catch (error) {
      throw new NotFoundException(error.message, error.status);
    }
  }

  @Get('/saldo/:id')
  async saldoFerias(@Param('id') id: string) {
    return await this.solicitacoesService.calculaSaldoDeFerias(id);
  }

  @Get('/pode/:id')
  async podeSolicitar(@Param('id') id: string) {
    try {
      return await this.solicitacoesService.podeTirarFerias(id, 10);
    } catch (error) {
      throw new NotFoundException(error.message, error.status);
    }
    
  }
}


