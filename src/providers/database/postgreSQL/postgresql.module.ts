import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmOptionsCore } from '../../../config/database/postgreSQL/postgresql.config';
import { CORE } from '../../../common/constants/constants';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: CORE,
            useFactory: () => (typeOrmOptionsCore),
            dataSourceFactory: async (options: DataSourceOptions) => {
                const dataSource = await new DataSource(options).initialize();
                return dataSource;
            },
        }),
    ],
    exports: [TypeOrmModule],
    controllers: [],
    providers: [],
})
export class PostgreSQLModule { }
