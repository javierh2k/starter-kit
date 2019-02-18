import {
    Index,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
    RelationId
} from 'typeorm';
import { task } from './task';

@Entity('user', { schema: 'public' })
export class user {
    @Column('uuid', {
        nullable: false,
        primary: true,
        default: 'uuid_generate_v4()',
        name: 'id',
    })
    public id: string;

    @Column('character varying', {
        nullable: false,
        length: 255,
        name: 'first_name',
    })
    public first_name: string;

    @Column('character varying', {
        nullable: false,
        length: 255,
        name: 'last_name',
    })
    public last_name: string;

    @Column('character varying', {
        nullable: false,
        length: 255,
        name: 'email',
    })
    public email: string;

    @Column('character varying', {
        nullable: false,
        length: 255,
        name: 'username',
    })
    public username: string;

    @Column('character varying', {
        nullable: false,
        length: 255,
        name: 'password',
    })
    public password: string;

    @OneToMany(type => task, task => task.user_)
    public tasks: task[];
}
