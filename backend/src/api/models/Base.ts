import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
// type : 'datetime' mysql

export abstract class Base {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    public created: Date;

    @UpdateDateColumn({ type: 'timestamp', select: false })
    public modified?: Date;

    @Column({ type: 'timestamp', nullable: true, select: false })
    public deleted?: Date;
}
