import { Column, Entity, JoinColumn, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuarios } from "src/usuario/entities/usuario.entity";
import { IsBoolean, IsDateString, IsIn, IsNotEmpty, IsString } from "class-validator";

@Entity({name: 'solicitacoes'})
export class Solicitacoes {
  
    @PrimaryGeneratedColumn('uuid')	
    id: string;

    @Column()
    @IsDateString()
    data_abertura: string;

    @Column()
    @IsDateString()
    data_conclusao: string;

    @Column()
    @IsString()
    comentario_gestor: string;

    @Column()
    @IsString()
    comentario_colaborador: string;

    // relaciona com id da tabela usuario
    @ManyToOne(() => Usuarios, usuarios => usuarios.id)
    @JoinColumn({name: 'id_colaborador'})
    id_colaborador: string;

    // relaciona com id da tabela usuarios
    @ManyToOne(() => Usuarios, usuarios => usuarios.id)
    @JoinColumn({name: 'id_gestor'})
    id_gestor: string;

    @Column()
    @IsBoolean()
    decimo_terceiro: boolean;
    
    @Column()
    @IsIn(['APROVADO', 'REPROVADA', 'PENDENTE'])
    estado: string;

    @Column()
    @IsDateString()
    ferias_inicio: string;
    
    @Column()
    @IsDateString()
    ferias_fim: string;


}
