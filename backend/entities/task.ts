import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {user} from "./user";


@Entity("task",{schema:"public"})
export class task {

    @Column("uuid",{ 
        nullable:false,
        primary:true,
        default:"uuid_generate_v4()",
        name:"id"
        })
    id:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:255,
        name:"title"
        })
    title:string;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_completed"
        })
    is_completed:boolean;
        

   
    @ManyToOne(type=>user, user=>user.tasks,{  })
    @JoinColumn({ name:'user_id'})
    user_:user | null;

}
