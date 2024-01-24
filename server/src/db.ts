import { DataSource } from 'typeorm'

console.log(process.env)
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_URL,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: [`${__dirname}/**/entities/*.{ts,js}`],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`]
})
