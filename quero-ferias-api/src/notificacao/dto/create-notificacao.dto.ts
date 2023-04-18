import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Usuarios } from "src/usuario/entities/usuario.entity";
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class CreateNotificacaoDto {
    @Column()
    @IsNotEmpty()
    @IsString()
    mensagem: string;
  
    @Column({ type: 'date' })
    @IsOptional()
    @IsDateString()
    data_hora: string;
  
    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    @IsOptional()
    lida: boolean;
  
    @ManyToOne(() => Usuarios,{ nullable: false })
    @JoinColumn({name: 'id_usuario', referencedColumnName: 'id'})
    id_usuario: string;

}
