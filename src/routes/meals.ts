import { FastifyInstance } from 'fastify'
import { knex } from '../knex/knex'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { REPL_MODE_SLOPPY } from 'node:repl'
import { request } from 'node:http'

export async function mealRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
      const sessionId = request.cookies.sessionId

      const meals = await knex('meals').select().where('session_id', sessionId)

      return { meals }
    }
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
      const getMealParamsSchema = z.object({
        id: z.uuid()
      })

      const { id } = getMealParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      const meal = await knex('meals')
        .select()
        .where({
          id,
          session_id: sessionId
        })
        .first()

      return { meal }
    }
  )

  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists]
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        isOnDiet: z.enum(['yes', 'no'])
      })

      const { sessionId } = request.cookies
      const { title, description, isOnDiet } = createMealBodySchema.parse(
        request.body
      )

      await knex('meals').insert({
        id: randomUUID(),
        title,
        description,
        is_on_diet: isOnDiet === 'yes' ? true : false,
        session_id: sessionId
      })

      return reply.status(201).send
    }
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists]
    },
    async (request, reply) => {
      const updateMealParamsSchema = z.object({
        id: z.uuid()
      })

      const updateMealBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        isOnDiet: z.enum(['yes', 'no'])
      })

      const { sessionId } = request.cookies
      const { id } = updateMealParamsSchema.parse(request.params)
      const { title, description, isOnDiet } = updateMealBodySchema.parse(
        request.body
      )

      await knex('meals')
        .where({ session_id: sessionId, id })
        .update({
          title,
          description,
          is_on_diet: isOnDiet === 'yes' ? true : false,
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
      const deleteMealParamsSchema = z.object({
        id: z.uuid()
      })

      const { id } = deleteMealParamsSchema.parse(request.params)

      await knex('meals').delete().where({ id })

      return reply.status(200).send()
    }
  )
}
