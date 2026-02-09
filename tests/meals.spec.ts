import { it, beforeAll, beforeEach, afterAll, describe, expect } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('pnpm run knex migrate:rollback --all || true')
    execSync('pnpm run knex migrate:latest')
  })

  it('should create a new meal', async () => {
    const createNewUserResponse = await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })

    const cookies = createNewUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        title: 'New Meal',
        description: 'White bread, eggs and coffee',
        isOnDiet: 'yes'
      })
      .expect(201)
  })

  it('should list all meals', async () => {
    const createNewUserResponse = await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })

    const cookies = createNewUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Breakfast',
      description: 'White bread, eggs and coffee',
      isOnDiet: 'yes'
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Lunch',
      description: 'Lasagna',
      isOnDiet: 'no'
    })

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listAllMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        title: 'Breakfast',
        description: 'White bread, eggs and coffee',
        is_on_diet: 1
      }),
      expect.objectContaining({
        title: 'Lunch',
        description: 'Lasagna',
        is_on_diet: 0
      })
    ])
  })

  it('should list a single meal', async () => {
    const createNewUserResponse = await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })

    const cookies = createNewUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Breakfast',
      description: 'White bread, eggs and coffee',
      isOnDiet: 'yes'
    })

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listAllMealsResponse.body.meals[0].id

    const listSingleMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(listSingleMealResponse.body.meal).toEqual(
      expect.objectContaining({
        title: 'Breakfast',
        description: 'White bread, eggs and coffee',
        is_on_diet: 1
      })
    )
  })

  it('should delete a meal', async () => {
    const createNewUserResponse = await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })

    const cookies = createNewUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Breakfast',
      description: 'White bread, eggs and coffee',
      isOnDiet: 'yes'
    })

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listAllMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)
  })

  it('should update a meal', async () => {
    const createNewUserResponse = await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })

    const cookies = createNewUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Breakfast',
      description: 'White bread, eggs and coffee',
      isOnDiet: 'yes'
    })

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listAllMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        title: 'Dinner',
        description: 'Pizza',
        isOnDiet: 'no'
      })
      .expect(200)
  })

  it('should list the total meals count', async () => {
    const createNewUserResponse = await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })

    const cookies = createNewUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Breakfast',
      description: 'White bread, eggs and coffee',
      isOnDiet: 'yes'
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Lunch',
      description: 'Lasagna',
      isOnDiet: 'no'
    })

    const totalMealsCountResponse = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(totalMealsCountResponse.body).toEqual([{ total_meals: 2 }])
  })

  it('should list the total count of diet-compliant meals', async () => {
    const createNewUserResponse = await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })

    const cookies = createNewUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Breakfast',
      description: 'White bread, eggs and coffee',
      isOnDiet: 'yes'
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Lunch',
      description: 'Lasagna',
      isOnDiet: 'no'
    })

    const dietCompliantResponse = await request(app.server)
      .get('/meals/summary/diet-compliant')
      .set('Cookie', cookies)
      .expect(200)

    expect(dietCompliantResponse.body).toEqual(
      expect.objectContaining({
        on_diet: [
          {
            total_meals_on_diet: 1
          }
        ],
        off_diet: [
          {
            total_meals_off_diet: 1
          }
        ]
      })
    )
  })

  it('should calculate the best on-diet meal streak', async () => {
    const createNewUserResponse = await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })

    const cookies = createNewUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Breakfast',
      description: 'White bread, eggs and coffee',
      isOnDiet: 'yes'
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Lunch',
      description: 'Lasagna',
      isOnDiet: 'no'
    })

    const streakResponse = await request(app.server)
      .get('/meals/streak')
      .set('Cookie', cookies)
      .expect(200)

    expect(streakResponse.body).toEqual(
      expect.objectContaining({
        best_streak: 1,
        current_streak: 0
      })
    )
  })
})
