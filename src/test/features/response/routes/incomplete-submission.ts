import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from './checks/ccj-requested-check'
import { checkNotDefendantInCaseGuard } from './checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: incomplete submission page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
    })

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      draftStoreServiceMock.resolveFind('response')
      claimStoreServiceMock.resolveRetrieveClaimByExternalId()

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful
          .withText('You need to complete all sections before you submit your response'))
    })
  })
})
