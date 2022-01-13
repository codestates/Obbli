import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Org_review } from "./Org_review";
import { Person_review } from "./Person_review";
import { Application } from "./Application";
import { Skill } from "./Skill";

@Entity()
export class Person extends BaseEntity{
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  user_id: string;

  @Column()
  pw_hash: string;

  @Column()
  realname: string;

  @Column({ default: false })
  professional: boolean;

  @Column({ nullable: true })
  history: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  cellular: string;

  @Column({ type: "uuid", nullable: true })
  skill_uuid: string;

  @CreateDateColumn()
  readonly created_at: Date;

  @OneToMany(() => Org_review, (Org_review) => Org_review.Person)
  Org_review: Org_review[];

  @OneToMany(() => Person_review, (Person_review) => Person_review.Person)
  Person_review: Person_review[];

  @OneToMany(() => Application, (Application) => Application.Person)
  Application: Application[];

  @ManyToOne((type) => Skill)
  @JoinColumn({ name: "skill_uuid" })
  Skill: Skill;
}
