import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/dashboard/routes/checks/authorization-check'
import { MomentFactory } from 'shared/momentFactory'
import {
  partialAdmissionFromStatesPaidDefence, partialAdmissionFromStatesPaidWithMediationDefence
} from 'test/data/entity/responseData'
import {
  claimantRejectAlreadyPaid,
  claimantRejectAlreadyPaidWithMediation,
  respondedAt
} from 'test/data/entity/fullDefenceData'
import { MediationOutcome } from 'claims/models/mediationOutcome'

const statesPaidClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  ...respondedAt
}

const cookieName: string = config.get<string>('session.cookieName')

const testData = [
  {
    status: 'States paid defence - defendant paid what he believed he owed - claimant rejects',
    claim: statesPaidClaim,
    claimOverride: {
      response: {
        ...partialAdmissionFromStatesPaidDefence
      },
      ...claimantRejectAlreadyPaid
    },
    claimantAssertions: ['Wait for the court to review the case'],
    defendantAssertions: ['Wait for the court to review the case']
  },
  {
    status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects',
    claim: statesPaidClaim,
    claimOverride: {
      response: {
        ...partialAdmissionFromStatesPaidWithMediationDefence
      },
      ...claimantRejectAlreadyPaidWithMediation
    },
    claimantAssertions: ['We’ll contact you to try to arrange a mediation appointment'],
    defendantAssertions: ['We’ll contact you to try to arrange a mediation appointment']
  },
  {
    status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - mediation failed',
    claim: statesPaidClaim,
    claimOverride: {
      response: {
        ...partialAdmissionFromStatesPaidWithMediationDefence
      },
      ...claimantRejectAlreadyPaidWithMediation,
      mediationOutcome: MediationOutcome.FAILED
    },
    claimantAssertions: ['Mediation was unsuccessful'],
    defendantAssertions: ['Mediation was unsuccessful']
  },
  {
    status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - mediation success',
    claim: statesPaidClaim,
    claimOverride: {
      response: {
        ...partialAdmissionFromStatesPaidWithMediationDefence
      },
      ...claimantRejectAlreadyPaidWithMediation,
      mediationOutcome: MediationOutcome.SUCCEEDED
    },
    claimantAssertions: ['You both agreed a settlement through mediation'],
    defendantAssertions: ['You both agreed a settlement through mediation']
  }
]

describe('Dashboard page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', Paths.dashboardPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      context('Dashboard Status', () => {
        context('as a claimant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          })

          testData.forEach(data => {
            it(`should render dashboard: ${data.status}`, async () => {
              draftStoreServiceMock.resolveFindNoDraftFound()
              claimStoreServiceMock.resolveRetrieveByClaimantId(data.claim, data.claimOverride)
              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
            })
          })
        })

        context('as a defendant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList()
          })

          testData.forEach(data => {
            it(`should render dashboard: ${data.status}`, async () => {
              draftStoreServiceMock.resolveFindNoDraftFound()
              claimStoreServiceMock.resolveRetrieveByDefendantId(data.claim.referenceNumber, '1', data.claim, data.claimOverride)
              await request(app)
                .get(Paths.dashboardPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
            })
          })
        })
      })
    })
  })
})
