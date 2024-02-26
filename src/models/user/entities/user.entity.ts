import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Status } from "src/common/enums/enums";
import { Url } from "src/models/url/entities/url.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @ApiProperty({ name: 'uuid', type: 'uuid' })
    @PrimaryGeneratedColumn('uuid', { name: 'u_uuid' })
    uuid: string;

    @ApiProperty({ name: 'fullName', type: 'string' })
    @Column({ name: 'u_fullname', type: 'varchar', length: 255 })
    fullName: string;

    @ApiProperty({ name: 'email', type: 'string' })
    @Column({ name: 'u_email', type: 'varchar', length: 255, unique: true })
    email: string;

    @ApiProperty({ name: 'status', enum: Status })
    @Column({ name: 'u_status', type: 'enum', enum: Status, default: Status.ACTIVE })
    status: Status;

    @ApiProperty({ name: 'creationDate', type: 'datetime' })
    @CreateDateColumn({ name: 'u_creation_date', type: 'timestamp' })
    creationDate: Date;

    @ApiProperty({ name: 'createdBy', type: 'string' })
    @Column({ name: 'u_created_by', type: 'varchar', length: 255 })
    createdBy: string;

    @ApiProperty({ name: 'modifiedDate', type: 'datetime' })
    @UpdateDateColumn({ name: 'u_modified_date', type: 'timestamp', nullable: true })
    modifiedDate: Date;

    @ApiProperty({ name: 'modifiedBy', type: 'string' })
    @Column({ name: 'u_modified_by', type: 'varchar', length: 255, nullable: true })
    modifiedBy: string;

    @ApiProperty({ name: 'deletedAt', type: 'datetime' })
    @DeleteDateColumn({ name: 'u_deletion_date', type: 'timestamp', nullable: true })
    deletedAt: Date;

    @ApiProperty({ name: 'deletedBy', type: 'string' })
    @Column({ name: 'u_deleted_by', type: 'varchar', length: 255, nullable: true })
    deletedBy: string;

    @ApiHideProperty()
    @OneToMany(() => Url, (url) => url.user)
    urls: Url[];
}
