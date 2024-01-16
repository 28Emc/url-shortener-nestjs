import { Status } from "src/common/enums/enums";
import { Url } from "src/models/url/entities/url.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ name: 'u_id' })
    userId: number;

    @Column({ name: 'u_email', type: 'varchar', length: 255 })
    email: string;

    @Column({ name: 'u_username', type: 'varchar', length: 255 })
    username: string;

    @Column({ name: 'u_password', type: 'varchar', length: 255 })
    password: string;

    @Column({ name: 'u_status', type: 'enum', enum: Status, default: Status.ACTIVE })
    status: Status;

    @CreateDateColumn({ name: 'u_creation_date', type: 'timestamp' })
    creationDate: Date;

    @Column({ name: 'u_created_by', type: 'varchar', length: 255 })
    createdBy: string;

    @UpdateDateColumn({ name: 'u_modified_date', type: 'timestamp', nullable: true })
    modifiedDate: Date;

    @Column({ name: 'u_modified_by', type: 'varchar', length: 255, nullable: true })
    modifiedBy: string;

    @DeleteDateColumn({ name: 'u_deletion_date', type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ name: 'u_deleted_by', type: 'varchar', length: 255, nullable: true })
    deletedBy: string;

    @OneToMany(() => Url, (url) => url.user)
    urls: Url[];
}
