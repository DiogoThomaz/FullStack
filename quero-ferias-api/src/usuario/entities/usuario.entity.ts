import { Squad } from "src/squad/entities/squad.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity({name: 'usuarios'})
export class Usuarios {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    matricula: number;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    senha: string;

    @Column()
    tipo_contrato: string;
    
    @Column()
    tipo_usuario: string;

    @Column()
    ativo: boolean;

    @Column()
    cargo: string;

    @Column()
    data_contratacao: Date;

    @Column()
    id_squad: string;

    @Column()
    gmail: string;

    

}
