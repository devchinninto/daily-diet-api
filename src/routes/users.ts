import { FastifyInstance } from 'fastify'
import { knex } from '../knex/knex'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

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

  app.get('/', async (request, reply) => {
    const users = await knex('users').select()

    return reply.status(200).send({ users })
  })

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists]
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const getIdParamsSchema = z.object({
        id: z.uuid()
      })

      const getUpdateBodySchema = z.object({
        first_name: z.string(),
        last_name: z.string(),
        birth_date: z.string()
      })

      const { id } = getIdParamsSchema.parse(request.params)
      const { first_name, last_name, birth_date } = getUpdateBodySchema.parse(
        request.body
      )

      await knex('users').where({ id, session_id: sessionId }).update({
        first_name,
        last_name,
        birth_date,
        updated_at: knex.fn.now()
      })

      return reply.status(200).send()
    }
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists]
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const getIdParamsSchema = z.object({
        id: z.uuid()
      })

      const { id } = getIdParamsSchema.parse(request.params)

      await knex('users').delete().where({ id, session_id: sessionId })

      return reply.status(200).send()
    }
  )
}
