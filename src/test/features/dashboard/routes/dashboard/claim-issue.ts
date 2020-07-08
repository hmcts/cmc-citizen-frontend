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

const cookieName: string = config.get<string>('session.cookieName')

const testData = [
  {
    status: 'Claim issued',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      responseDeadline: MomentFactory.currentDate().add(1, 'days')
    },
    claimantAssertions: ['000MC050', 'Wait for the defendant to respond'],
    defendantAssertions: ['000MC050', 'Respond to claim.']
  },
  // todo uncomment and add condition based dashboard once the backend implementation is finished
  // {
  //   status: 'Claim issued with HWF reference',
  //   claim: claimStoreServiceMock.sampleHwfClaimIssueObj,
  //   claimOverride: {
  //     responseDeadline: MomentFactory.currentDate().add(1, 'days')
  //   },
  //   claimantAssertions: ['123', 'We’re checking your Help With Fees application'],
  //   defendantAssertions: ['000MC050', 'Respond to claim.']
  // },
  {
    status: 'Requested more time',
    claim: claimStoreServiceMock.sampleClaimIssueObj,
    claimOverride: {
      moreTimeRequested: true,
      responseDeadline: '2099-08-08'
    },
    claimantAssertions: ['000MC050', 'John Doe has requested more time to respond.'],
    defendantAssertions: ['000MC050', 'You need to respond before 4pm on 8 August 2099.']
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
