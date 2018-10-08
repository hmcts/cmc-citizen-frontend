import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes-parallel/common/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'

const parallel = require('mocha.parallel')

describe('Privacy Policy page', () => {
  parallel('hooks', function () {
    describe('on GET', () => {
      it('should render privacy policy page when everything is fine', async () => {
        await request(app)
          .get(Paths.privacyPolicyPage.uri)
          .expect(res => expect(res).to.be.successful.withText('Privacy policy'))
      })
    })
  })
})
