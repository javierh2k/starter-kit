import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";


@Entity("migrations",{schema:"public"})
export class migrations {

    @PrimaryGeneratedColumn({ 
        name:"id"
        })
    id:number;
        

    @Column("bigint",{ 
        nullable:false,
        name:"timestamp"
        })
    timestamp:string;
        

    @Column("character varying",{ 
        nullable:false,
        name:"name"
        })
    name:string;
        
}
