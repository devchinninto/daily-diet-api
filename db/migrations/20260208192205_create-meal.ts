import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    ;(table.uuid('id').primary(),
      table.string('title').notNullable(),
      table.string('description').notNullable(),
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(),
      table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(),
      table.boolean('is_on_diet').defaultTo('true').notNullable(),
      table.string('session_id').references('session_id').inTable('users'))
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
