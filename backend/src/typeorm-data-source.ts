import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dbConfig from './config/database.config.js';
import { User } from './modules/users/entities/user.entity.js';

export default new DataSource({
  type: 'postgres',
  host: dbConfig().host,
  port: dbConfig().port,
  username: dbConfig().username,
  password: dbConfig().password,
  database: dbConfig().database,
  entities: [User],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
});
