import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes/expectations'

import { app } from 'main/app'

describe('testing liveness', () => {
  it('should return 200 OK', async () => {
    await request(app)
      .get('/health/liveness')
      .expect(res => {
        expect(res.status).equal(200)
        expect(res.body.status).equal('UP')
      })
  })
})
