import { Status } from "src/common/enums/enums";
import { Statistic } from "src/models/statistic/entities/statistic.entity";
import { User } from "src/models/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity({ name: 'urls' })
export class Url {
    @PrimaryGeneratedColumn({ name: 'u_id' })
    urlId: number;

    @Column({ name: 'u_uuid', type: 'varchar', length: 255, nullable: false })
    uuid: string;

    @Column({ name: 'u_original_url', type: 'varchar', length: 255, nullable: false })
    originalUrl: string;

    @Column({ name: 'u_short_url', type: 'varchar', length: 255, nullable: false })
    shortUrl: string;

    @Column({ name: 'u_click_nro', type: 'int', nullable: false, default: 0 })
    clickNro: number;

    @Column({ name: 'u_status', type: 'enum', enum: Status, default: Status.ACTIVE })
    status: Status;

    @CreateDateColumn({ name: 'u_creation_date', type: 'timestamp' })
    creationDate: Date;

    @Column({ name: 'u_created_by', type: 'varchar', length: 255 })
    createdBy: string;

    @ManyToOne(() => User, (user) => user.urls)
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(() => Statistic, (statistic) => statistic.url)
    statistics: Statistic[];
}
