import { expect } from 'chai'
import * as request from 'supertest'

import '../routes/expectations'

import { app } from '../../main/app'
import { Paths } from 'app/paths'

describe('Terms and Conditions page', () => {
  describe('on GET', () => {
    it('should render the Terms and conditions page when everything is fine', async () => {
      await request(app)
        .get(Paths.termsAndConditionsPage.uri)
        .expect(res => expect(res).to.be.successful.withText('By using this service you’re agreeing to the following terms of use.'))
    })
  })
})
