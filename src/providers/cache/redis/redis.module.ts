import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { REDIS_HOST, REDIS_PORT } from 'src/common/constants/constants';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                store: await redisStore({
                    socket: {
                        host: configService.get<string>(REDIS_HOST),
                        port: configService.get<number>(REDIS_PORT)
                    }
                })
            }),
        }),
    ],
    exports: [CacheModule],
    controllers: [],
    providers: [],
})
export class RedisModule { }
