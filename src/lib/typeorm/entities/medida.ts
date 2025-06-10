import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Medida {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("float")
  temperatura!: number;

  @Column("float")
  umidade!: number;

  @Column("float")
  luminosidade!: number;

  @Column("float")
  gas!: number;

  @Column("float")
  chanceVida!: number;

  @CreateDateColumn()
  dataHora!: Date;
}
