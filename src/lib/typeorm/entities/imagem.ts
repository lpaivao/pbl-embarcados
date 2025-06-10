import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medida } from "./medida";

@Entity()
export class Imagem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @OneToOne(() => Medida)
  @JoinColumn()
  medida!: Medida;
}
