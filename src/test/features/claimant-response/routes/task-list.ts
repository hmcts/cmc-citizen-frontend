import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import 'test/routes/expectations'
import { attachDefaultHooks } from 'test/routes/hooks'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { checkAuthorizationGuards } from 'test/routes/authorization-check'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

const taskListPagePath = ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const incompleteSubmissionPagePath = ClaimantResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj

describe('Claimant response: task list page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', incompleteSubmissionPagePath)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claimantResponse')
      draftStoreServiceMock.resolveFind('mediation')
      draftStoreServiceMock.resolveFind('directionsQuestionnaire')
      claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)

      await request(app)
        .get(taskListPagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('Your response'))
    })
  })
})
