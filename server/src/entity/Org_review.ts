import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Org } from "./Org";
import { Person } from "./Person";

@Entity()
export class Org_review extends BaseEntity {
  @PrimaryColumn('uuid')
  person_uuid: string;

  @PrimaryColumn('uuid')
  org_uuid: string;

  @Column()
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  readonly created_at: Date;

  @ManyToOne(type => Person)
  @JoinColumn({ name: 'person_uuid' })
  Person: Person;

  @ManyToOne(type => Org)
  @JoinColumn({ name: 'org_uuid' })
  Org: Org;
}
