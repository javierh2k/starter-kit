import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Base } from './Base';

@Entity()
export class Task extends Base {

    @IsNotEmpty() // nullable: true
    @Column()
    public title: string;

    @IsNotEmpty()
    @Column({ name: 'is_completed' })
    public isCompleted: boolean;

    @Column({
        name: 'user_id',
        nullable: false,
    })
    public userId: string;

    @ManyToOne(type => User, user => user.tasks)
    @JoinColumn({ name: 'user_id' })
    public user: User;

    public toString(): string {
        return `${this.title}`;
    }
}
