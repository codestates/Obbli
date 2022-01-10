import {
  BaseEntity,
  Column,
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Advert } from "./Advert";
import { Application } from "./Application";
import { Skill } from "./Skill";

@Entity()
export class Position extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('uuid')
  advert_uuid: string;

  @Column('uuid')
  skill_uuid: string;

  @Column()
  quota: number;

  @OneToMany(() => Application, (Application) => Application.Position)
  Application: Application;

  @ManyToOne(type => Advert)
  @JoinColumn({ name: 'advert_uuid' })
  Advert: Advert;

  @ManyToOne(type => Skill)
  @JoinColumn({ name: 'skill_uuid' })
  Skill: Skill;
}
