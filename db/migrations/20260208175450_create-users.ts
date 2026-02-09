import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    ;(table.uuid('id').primary(),
      table.uuid('session_id').unique(),
      table.string('first_name').notNullable(),
      table.string('last_name').notNullable(),
      table.date('birth_date').notNullable,
      table.timestamp('created_at').defaultTo(knex.fn.now()),
      table.timestamp('updated_at').defaultTo(knex.fn.now()))
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
