import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Position } from './Position';
import { Org } from './Org';

@Entity()
export class Advert {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('uuid')
  org_uuid: string;

  @CreateDateColumn()
  readonly created_at: Date;

  @Column()
  content: string;

  @OneToMany(() => Position, (Position) => Position.Advert)
  Position: Position[];

  @ManyToOne(() => Org, (Org) => Org.Advert)
  @JoinColumn({ name: 'org_uuid' })
  Org: Org;
}
