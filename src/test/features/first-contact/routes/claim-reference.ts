import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths as DefendantFirstContactPaths } from 'first-contact/paths'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { app } from 'main/app'

describe('Defendant first contact: claim reference page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      await request(app)
        .get(DefendantFirstContactPaths.claimReferencePage.uri)
        .expect(res => expect(res).to.be.successful.withText('Enter your claim number'))
    })
  })

  describe('on POST', () => {
    it('should render page when form is invalid and everything is fine', async () => {
      await request(app)
        .post(DefendantFirstContactPaths.claimReferencePage.uri)
        .expect(res => expect(res).to.be.successful.withText('Enter your claim number', 'div class="error-summary"'))
    })

    it('should redirect to pin validation page when form is valid and everything is fine', async () => {
      const redirectPattern = new RegExp(`${config.get('idam.authentication-web.url')}/login/pin\\?.+redirect_uri=https://127.0.0.1:[0-9]{1,5}/receiver`)
      claimStoreServiceMock.resolveIsClaimLinked(false)

      await request(app)
        .post(DefendantFirstContactPaths.claimReferencePage.uri)
        .send({ reference: '000MC001' })
        .expect(res => expect(res).to.be.redirect.toLocation(redirectPattern))
    })

    it('should redirect to mcol when CCBC prefix is used', async () => {
      await request(app)
        .post(DefendantFirstContactPaths.claimReferencePage.uri)
        .send({ reference: 'A1ED1123' })
        .expect(res => expect(res).to.be.redirect.toLocation(config.get<string>('mcol.url')))
    })

    it('should redirect to "/" when form is valid and claim has already been linked', async () => {
      claimStoreServiceMock.resolveIsClaimLinked(true)

      await request(app)
        .post(DefendantFirstContactPaths.claimReferencePage.uri)
        .send({ reference: '000MC001' })
        .expect(res => expect(res).to.be.redirect.toLocation('/'))
    })
    it('should return 500 and render error page when cannot check claim status', async () => {
      claimStoreServiceMock.rejectIsClaimLinked()

      await request(app)
        .post(DefendantFirstContactPaths.claimReferencePage.uri)
        .send({ reference: '000MC001' })
        .expect(res => expect(res).to.be.serverError.withText('Error'))
    })
  })
})
