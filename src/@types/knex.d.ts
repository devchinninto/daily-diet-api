// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      first_name: string
      last_name: string
      birth_date: string
      created_at: string
      updated_at: string
      session_id?: string
    }
  }
}
