import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Usuarios } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'notificacoes' })
export class Notificacao {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  mensagem: string;

  @Column({ type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  data_hora: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  lida: boolean;

  @ManyToOne(() => Usuarios,{ nullable: false })
  @JoinColumn({name: 'id_usuario', referencedColumnName: 'id'})
  id_usuario: string;

}
