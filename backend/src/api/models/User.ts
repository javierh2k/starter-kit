import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Task } from './Task';
import { Base } from './Base';

enum Gender {
    Male = 'MALE',
    Female = 'FEMALE',
}

export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

@Entity()
export class User extends Base {
    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(
        user: User,
        password: string
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                resolve(res === true);
            });
        });
    }

    @IsNotEmpty()
    @Column({ name: 'first_name' })
    public firstName: string;

    @IsNotEmpty()
    @Column({ name: 'last_name' })
    public lastName: string;

    @IsNotEmpty()
    @Column()
    public email: string;

    @IsNotEmpty()
    @Column()
    @Exclude()
    public password: string;

    @IsNotEmpty()
    @Column()
    public username: string;

    @Column('enum', { enum: Status, default: Status.ACTIVE })
    public status: Status;

    @Column('enum', { enum: Gender, default: Gender.Male })
    public gender: Gender;

    @OneToMany(type => Task, task => task.user)
    public tasks: Task[];

    public toString(): string {
        return `${this.firstName} ${this.lastName} (${this.email})`;
    }

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.password = await User.hashPassword(this.password);
    }
}
