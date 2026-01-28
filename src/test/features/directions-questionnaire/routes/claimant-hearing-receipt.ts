import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { getSessionCookie } from 'test/auth-helper'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Paths } from 'directions-questionnaire/paths'
import { app } from 'main/app'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'


const pagePath = Paths.claimantHearingRequirementsReceiver.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const claimWithDQ = {
  ...claimStoreServiceMock.sampleClaimObj,
  ...{ features: ['directionsQuestionnaire'] }
}

describe('Claimant response: confirmation page', () => {
  let sessionCookie: string
  beforeEach(async () => {
    sessionCookie = await getSessionCookie(app)
  })
  attachDefaultHooks(app)

  describe('on GET', () => {

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when claimant click on download hearing requirements', () => {

        it('should call documentclient to download claimant hearing requirement', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
          claimStoreServiceMock.resolveRetrieveDocument()
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', sessionCookie)
            .expect(res => expect(res).to.be.successful)
        })
      })
    })
  })
})
