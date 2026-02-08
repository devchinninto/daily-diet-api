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
    execSync('pnpm run knex migrate:rollback')
    execSync('pnpm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        first_name: 'New',
        last_name: 'User',
        birth_date: '11/01/1999'
      })
      .expect(201)
  })
})
