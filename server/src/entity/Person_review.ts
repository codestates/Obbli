import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Person } from "./Person";
import { Org } from "./Org";

@Entity()
export class Person_review extends BaseEntity {
  // @PrimaryColumn('uuid')
  // person_uuid: string;

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

  // @ManyToOne(type => Org)
  // @JoinColumn({ name: 'org_uuid' })
  // Org: Org;
}
