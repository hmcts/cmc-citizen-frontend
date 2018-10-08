import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes-parallel/common/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'

const parallel = require('mocha.parallel')

describe('Resolving Dispute page', () => {
  parallel('hooks', function () {
    describe('on GET', () => {
      it('should render resolve before claim page when everything is fine', async () => {
        await request(app)
          .get(Paths.resolveBeforeClaimPage.uri)
          .expect(res => expect(res).to.be.successful.withText('Try to resolve the dispute'))
      })
    })
  })
})
