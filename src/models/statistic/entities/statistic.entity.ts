import { Url } from "src/models/url/entities/url.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'statistics' })
export class Statistic {
    @PrimaryGeneratedColumn({ name: 's_id' })
    statisticId: number;

    @Column({ name: 's_browser_info', type: 'varchar', length: 255 })
    browserInfo: string;

    @Column({ name: 's_location_info', type: 'varchar', length: 255 })
    locationInfo: string;

    @CreateDateColumn({ name: 's_creation_date', type: 'timestamp' })
    creationDate: Date;

    @ManyToOne(() => Url, (url) => url.statistics)
    @JoinColumn({ name: "url_id" })
    url: Url;
}
