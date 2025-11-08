// En: src/message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Le dice a TypeORM que esto es una tabla
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;
}