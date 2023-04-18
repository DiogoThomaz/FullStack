import { Usuarios } from "src/usuario/entities/usuario.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'squads'})
export class Squad {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nome: string;

    // relaciona com id da tabela usuario
    @ManyToMany(() => Usuarios, { nullable: false })
    @Column()
    id_gestor: string;

}
