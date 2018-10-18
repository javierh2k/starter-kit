import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";
import {task} from "./task";


@Entity("user",{schema:"public"})
export class user {

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
        name:"first_name"
        })
    first_name:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:255,
        name:"last_name"
        })
    last_name:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:255,
        name:"email"
        })
    email:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:255,
        name:"username"
        })
    username:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:255,
        name:"password"
        })
    password:string;
        

   
    @OneToMany(type=>task, task=>task.user_)
    tasks:task[];
    
}
