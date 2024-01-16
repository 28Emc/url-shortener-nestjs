import { ConfigModule, ConfigService } from '@nestjs/config';
import { DB_HOST, DB_PASSWORD, DB_CORE_NAME, DB_SOCKET_PATH, DB_USER, ENV_FILE_PATH, LOCAL, POSTGRES, NODE_ENV, CORE } from '../../../common/constants/constants';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from 'src/models/user/entities/user.entity';
import { Url } from 'src/models/url/entities/url.entity';
import { Statistic } from 'src/models/statistic/entities/statistic.entity';

ConfigModule.forRoot({
  envFilePath: ENV_FILE_PATH,
});
const configService = new ConfigService();

let typeOrmOptions: PostgresConnectionOptions = {
  type: POSTGRES,
  port: 5432,
  username: configService.get<string>(DB_USER),
  password: configService.get<string>(DB_PASSWORD),
  logging: configService.get<string>(NODE_ENV) === LOCAL,
  synchronize: configService.get<string>(NODE_ENV) === LOCAL
};

if (configService.get<string>(NODE_ENV) === LOCAL) {
  typeOrmOptions = {
    ...typeOrmOptions,
    host: configService.get<string>(DB_HOST)
  };
} else {
  typeOrmOptions = {
    ...typeOrmOptions,
    host: configService.get<string>(DB_SOCKET_PATH),
    extra: {
      socketPath: configService.get<string>(DB_SOCKET_PATH)
    }
  };
}

export const typeOrmOptionsCore: PostgresConnectionOptions = {
  ...typeOrmOptions,
  name: CORE,
  database: configService.get<string>(DB_CORE_NAME),
  entities: [User, Url, Statistic],
};
