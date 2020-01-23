import { expect } from 'chai'
import * as request from 'supertest'

import 'test/routes/expectations'

import { app } from 'main/app'
import { Paths } from 'paths'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import { Paths as FirstContactPaths } from 'first-contact/paths'

describe('Gov UK entry points', () => {
  context('make claim', () =>
    describe('on GET', () =>
      it('should redirect to unauthenticated eligibility questions', () =>
        request(app)
          .get(Paths.makeClaimReceiver.uri)
          .expect(res => expect(res).to.be.redirect.toLocation(EligibilityPaths.startPage.uri))
      )
    )
  )
  context('respond to claim', () =>
    describe('on GET', () => {
      it('should redirect to first contact claim number page', () =>
        request(app)
          .get(Paths.respondToClaimReceiver.uri)
          .expect(res => expect(res).to.be.redirect.toLocation(FirstContactPaths.claimReferencePage.uri))
      )
    })
  )
  context('return to claim', () =>
    describe('on GET', () =>
      it('should redirect to enter claim number page', () =>
        request(app)
          .get(Paths.returnToClaimReceiver.uri)
          .expect(res => expect(res).to.be.redirect.toLocation(Paths.enterClaimNumberPage.uri))
      )
    )
  )
})
