import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths as DefendantFirstContactPaths } from 'first-contact/paths'

import { app } from '../../../../main/app'

describe('Defendant first contact: claim reference page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      await request(app)
        .get(DefendantFirstContactPaths.claimReferencePage.uri)
        .expect(res => expect(res).to.be.successful.withText('Enter the claim number from the email or letter we sent you.'))
    })
  })

  describe('on POST', () => {
    it('should render page when form is invalid and everything is fine', async () => {
      await request(app)
        .post(DefendantFirstContactPaths.claimReferencePage.uri)
        .expect(res => expect(res).to.be.successful.withText('Enter the claim number from the email or letter we sent you.', 'div class="error-summary"'))
    })

    it('should redirect to pin validation page when form is valid and everything is fine', async () => {
      const redirectPattern = new RegExp(`${config.get('idam.authentication-web.url')}/login/pin\\?continue-url=http://127.0.0.1:[0-9]{1,5}/first-contact/claim-summary\\?ref=000MC001`)

      await request(app)
        .post(DefendantFirstContactPaths.claimReferencePage.uri)
        .send({ reference: '000MC001' })
        .expect(res => expect(res).to.be.redirect.toLocation(redirectPattern))
    })
  })
})
