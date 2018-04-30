import { expect } from 'chai'
import * as request from 'supertest'

import '../routes/expectations'

import { app } from '../../main/app'
import { Paths } from 'app/paths'

describe('Contact us page', () => {
  describe('on GET', () => {
    it('should render cookies page when everything is fine', async () => {
      await request(app)
        .get(Paths.contactUsPage.uri)
        .expect(res => expect(res).to.be.successful.withText('Contact us'))
    })
  })
})
