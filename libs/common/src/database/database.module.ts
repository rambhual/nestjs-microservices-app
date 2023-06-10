import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { NestConfigModule } from '../nest-config/nest-config.module';

@Module({
    imports: [MongooseModule.forRootAsync({
        imports: [NestConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
            return {
                uri: config.get("MONGODB_URI")
            }
        }
    })]
})
export class DatabaseModule { }