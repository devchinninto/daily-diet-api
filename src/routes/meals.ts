import { FastifyInstance } from 'fastify'
import { knex } from '../knex/knex'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

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
}
