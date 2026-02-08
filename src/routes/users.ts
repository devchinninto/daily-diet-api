import { FastifyInstance } from 'fastify'
import { knex } from '../knex/knex'
import z from 'zod'
import { randomUUID } from 'node:crypto'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      first_name: z.string(),
      last_name: z.string(),
      birth_date: z.string()
    })

    const { first_name, last_name, birth_date } = createUserBodySchema.parse(
      request.body
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      first_name,
      last_name,
      birth_date,
      session_id: sessionId
    })

    return reply.status(201).send()
  })
}
