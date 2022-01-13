import {BaseEntity,Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Position } from './Position';
import { Org } from './Org';

@Entity()
export class Advert extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('uuid')
  org_uuid: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  active_until: Date;

  @Column()
  event_at: Date;

  @Column()
  location: string;

  @CreateDateColumn()
  readonly created_at: Date;

  @OneToMany(() => Position, (Position) => Position.Advert)
  Position: Position[];

  @ManyToOne(() => Org, (Org) => Org.Advert,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'org_uuid' })
  Org: Org;
}
