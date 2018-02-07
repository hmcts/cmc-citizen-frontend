import { expect } from 'chai'
import * as request from 'supertest'

import '../routes/expectations'

import { app } from '../../main/app'
import { Paths } from 'app/paths'

describe('Defendant first contact: start page', () => {
  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      await request(app)
        .get(Paths.resolveBeforeClaimPage.uri)
        .expect(res => expect(res).to.be.successful.withText('Talk to the person or organisation who owes you'))
    })
  })
})
