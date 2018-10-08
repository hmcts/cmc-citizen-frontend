import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes-parallel/common/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'

const expectedTextOnPage: string = 'talk to the person or organisation you say owes you'
const parallel = require('mocha.parallel')

describe('Defendant first contact: start page', () => {
  parallel('hooks', function () {
    describe('on GET', () => {
      it('should render page when everything is fine', async () => {
        await request(app)
          .get(Paths.resolveBeforeClaimPage.uri)
          .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
      })
    })
  })
})
