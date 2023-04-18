import { IsBoolean, IsDate, IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSolicitacoeDto {

    @IsOptional()
    @IsString()
    id: string;

    @IsOptional()
    @IsDateString()
    data_abertura: string;

    @IsOptional()
    @IsDateString()
    data_conclusao: string;

    @IsOptional()
    @IsString()
    comentario_gestor: string;

    @IsOptional()
    @IsString()
    comentario_colaborador: string;

    @IsOptional()
    @IsString()
    id_colaborador: string;

    @IsOptional()
    @IsString()
    id_gestor: string;

    @IsOptional()
    @IsBoolean()
    decimo_terceiro: boolean;
    
    @IsOptional()
    @IsIn(['APROVADO', 'REPROVADA', 'PENDENTE'])
    estado: string;

    @IsNotEmpty()
    @IsDateString()
    ferias_inicio: string;
    
    @IsNotEmpty()
    @IsDateString()
    ferias_fim: string;

}
