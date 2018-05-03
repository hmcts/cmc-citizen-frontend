import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths as DefendantFirstContactPaths } from 'first-contact/paths'

import { app } from 'main/app'

describe('Defendant first contact: start page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      await request(app)
        .get(DefendantFirstContactPaths.startPage.uri)
        .expect(res => expect(res).to.be.successful.withText('Respond to a money claim'))
    })
  })
})
