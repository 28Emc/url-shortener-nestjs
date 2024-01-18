import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Url } from "src/models/url/entities/url.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'statistics' })
export class Statistic {
    @ApiProperty({ description: 'Statistic ID' })
    @PrimaryGeneratedColumn({ name: 's_id' })
    statisticId: number;

    @ApiProperty({ description: 'Statistic browser info', example: 'Mozilla' })
    @Column({ name: 's_browser_info', type: 'varchar', length: 255 })
    browserInfo: string;

    @ApiProperty({ description: 'Statistic location info' })
    @Column({ name: 's_location_info', type: 'varchar', length: 255 })
    locationInfo: string;

    @ApiProperty({ description: 'Statistic creation date', type: 'datetime' })
    @CreateDateColumn({ name: 's_creation_date', type: 'timestamp' })
    creationDate: Date;

    @ApiHideProperty()
    @ManyToOne(() => Url, (url) => url.statistics)
    @JoinColumn({ name: "url_id" })
    url: Url;
}
