import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes-parallel/common/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'

const parallel = require('mocha.parallel')

describe('Contact us page', () => {
  parallel('hooks', function () {
    describe('on GET', () => {
      it('should render cookies page when everything is fine', async () => {
        await request(app)
          .get(Paths.contactUsPage.uri)
          .expect(res => expect(res).to.be.successful.withText('Contact us'))
      })
    })
  })
})
