import { it, beforeAll, beforeEach, afterAll, describe, expect } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('User routes', () => {
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

  it('should create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })
      .expect(201)
  })

  it('should get a list of all users', async () => {
    await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })
      .expect(201)

    const listAllUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    expect(listAllUsersResponse.body.users).toEqual([
      expect.objectContaining({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })
    ])
  })

  it('should update an user', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      first_name: 'New',
      last_name: 'User',
      birth_date: '11/01/1999'
    })

    const cookies = createUserResponse.get('Set-Cookie')

    const listAllUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    const userId = listAllUsersResponse.body.users[0].id

    await request(app.server)
      .put(`/users/${userId}`)
      .set('Cookie', cookies)
      .send({
        first_name: 'Updated',
        last_name: 'User',
        birth_date: '11/01/2000'
      })
      .expect(200)
  })

  it('should delete an user', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      first_name: 'New',
      last_name: 'User',
      birth_date: '11/01/1999'
    })

    const cookies = createUserResponse.get('Set-Cookie')

    const listAllUsersResponse = await request(app.server)
      .get('/users')
      .expect(200)

    const userId = listAllUsersResponse.body.users[0].id

    await request(app.server)
      .delete(`/users/${userId}`)
      .set('Cookie', cookies)
      .expect(200)
  })
})
