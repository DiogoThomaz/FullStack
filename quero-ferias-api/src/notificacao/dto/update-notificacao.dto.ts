import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { JoinColumn, ManyToOne } from "typeorm";
import { Usuarios } from "src/usuario/entities/usuario.entity";

export class UpdateNotificacaoDto {
    
    @IsOptional()
    @IsString()
    mensagem: string;
  
    @IsOptional()
    @IsDateString()
    data_hora: string;
    
    @IsOptional()
    @IsBoolean()
    @IsOptional()
    lida: boolean;
  
    @IsOptional()
    @ManyToOne(() => Usuarios,{ nullable: false })
    @JoinColumn({name: 'id_usuario', referencedColumnName: 'id'})
    id_usuario: string;
}
