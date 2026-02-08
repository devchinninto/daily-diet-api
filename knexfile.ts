import { env } from './src/env/index'

export default {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? {
          filename: env.DATABASE_URL
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extensions: 'ts',
    directory: './db/migrations'
  },
  seeds: {
    extensions: 'ts',
    directory: './db/seeds'
  }
}
