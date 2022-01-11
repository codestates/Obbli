import {
  Column,
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Position } from "./Position";
import { Person } from "./Person";

@Entity()
export class Skill extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @OneToMany(() => Position, (Position) => Position.Skill)
  Position: Position[];

  @OneToMany(() => Person, (Person) => Person.Skill)
  Person: Person[];
}
