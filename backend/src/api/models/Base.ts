import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// type : 'datetime' mysql

export abstract class Base {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    public created: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    public modified?: Date;

    @Column({ type: 'timestamptz', nullable: true })
    public deleted?: Date;
}
