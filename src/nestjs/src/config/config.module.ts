import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModule as NestJsModule,
  ConfigModuleOptions,
} from '@nestjs/config';
import { join } from 'path';
import * as joi from 'joi';

type DB_SCHEMA_TYPE = {
  DB_VENDOR: 'mysql' | 'sqlite';
  DB_HOST: string;
  DB_DATABASE: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
};

export const CONFIG_DB_SCHEMA: joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: joi.string().required().valid('mysql', 'sqlite'),
  DB_HOST: joi.string().required(),
  DB_DATABASE: joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: joi.required(),
  }),
  DB_USERNAME: joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: joi.required(),
  }),
  DB_PASSWORD: joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: joi.required(),
  }),
  DB_PORT: joi.number().integer().when('DB_VENDOR', {
    is: 'mysql',
    then: joi.required(),
  }),
  DB_LOGGING: joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: joi.boolean().required(),
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE; // if add others schema, just use `& EXAMPLE_SCHEMA_TYPE

@Module({})
export class ConfigModule extends NestJsModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath]),
        join(__dirname, `../envs/.env.${process.env.NODE_ENV}`),
        join(__dirname, '../envs/.env'),
      ],
      validationSchema: joi.object({ ...CONFIG_DB_SCHEMA }),
      ...otherOptions,
    });
  }
}
