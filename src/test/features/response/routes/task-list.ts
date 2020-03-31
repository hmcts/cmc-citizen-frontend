import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import { MomentFactory } from 'shared/momentFactory'
import { verifyRedirectForGetWhenAlreadyPaidInFull } from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.taskListPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: task list page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          claimStoreServiceMock.resolvePostponedDeadline(MomentFactory.currentDateTime().add(14, 'days').toString())

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Respond to a money claim'))
        })

        it('should render page and show a tag marking incomplete tasks', async () => {
          draftStoreServiceMock.resolveFind('response', { response: {} })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          claimStoreServiceMock.resolvePostponedDeadline(MomentFactory.currentDateTime().add(14, 'days').toString())

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => {
              expect(res).to.be.successful.withText('Respond to a money claim')
              expect(res.text.match(/INCOMPLETE/g)).length(1)
            })
        })
      })
    })
  })
})
