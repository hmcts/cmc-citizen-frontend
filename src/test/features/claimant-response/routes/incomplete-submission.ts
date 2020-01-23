import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ClaimantResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj

describe('Claimant response: incomplete submission page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

    })

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      draftStoreServiceMock.resolveFind('claimantResponse')
      draftStoreServiceMock.resolveFind('mediation')
      draftStoreServiceMock.resolveFind('directionsQuestionnaire')
      claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful
          .withText('You need to complete all sections before you submit your response'))
    })
  })
})
