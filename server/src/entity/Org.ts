import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  Connection,
} from "typeorm";
import { Advert } from "./Advert";
import { Org_review } from "./Org_review";
import { Person_review } from "./Person_review";

@Entity()
export class Org extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  user_id: string;

  @Column()
  pw_hash: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  since: Date;

  @Column({ nullable: true })
  headcount: number;

  @CreateDateColumn()
  readonly created_at: Date;

  @Column({ nullable:true })
  deleted_at: Date;

  @OneToMany(() => Org_review, (Org_review) => Org_review.Org)
  Org_review: Org_review[];

  @OneToMany(() => Person_review, (Person_review) => Person_review.Org)
  Person_review: Person_review[];

  @OneToMany(() => Advert, (Advert) => Advert.Org)
  Advert: Advert[];
}
