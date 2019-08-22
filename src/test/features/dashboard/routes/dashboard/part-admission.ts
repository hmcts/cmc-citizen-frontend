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
import { FreeMediationOption } from 'forms/models/freeMediation'

import {
  basePartialAdmissionData,
  baseResponseData
} from 'test/data/entity/responseData'

import {
  respondedAt,
  directionsQuestionnaireDeadline
} from 'test/data/entity/fullDefenceData'
import { FeatureToggles } from 'utils/featureToggles'

const cookieName: string = config.get<string>('session.cookieName')

const partAdmissionClaim = {
  ...claimStoreServiceMock.sampleClaimObj,
  responseDeadline: MomentFactory.currentDate().add(1, 'days'),
  response: {
    ...baseResponseData,
    ...basePartialAdmissionData,
    amount: 30
  },
  ...respondedAt
}

const legacyClaimDetails = [
  {
    status: 'Part admission - defendant part admits and rejects mediation DQs not enabled - claimant rejects part admission',
    claim: partAdmissionClaim,
    claimOverride: {
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.NO
      },
      claimantResponse: {
        settleForAmount: 'no',
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'Tell us your hearing requirements',
      'You rejected the defendant’s admission of',
      'Your claim won’t proceed if you don’t complete and return the form before'
    ],
    defendantAssertions: [
      partAdmissionClaim.claim.claimants[0].name + ' has rejected your admission of ',
      'They believe you owe them the full',
      'You might have to go to a hearing. We’ll contact you if we set a hearing date to tell you how to prepare.',
      'You need to ',
      'Your defence won’t proceed if you don’t complete and return the form before'
    ]
  },
  {
    status: 'Part admission - defendant part admits and accepts mediation DQs not enabled - claimant rejects part admission with mediation',
    claim: partAdmissionClaim,
    claimOverride: {
      features: ['admissions'],
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.YES
      },
      claimantResponse: {
        settleForAmount: 'no',
        freeMediation: FreeMediationOption.YES,
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: [
      'We’ll contact you with a mediation appointment',
      'You rejected the defendant’s admission of ',
      'You’ve both agreed to try mediation. We’ll contact you to arrange a call with the mediator.',
      'Find out how mediation works'
    ],
    defendantAssertions: [
      partAdmissionClaim.claim.claimants[0].name + ' has rejected your admission of',
      'They believe you owe them the full ',
      'They have agreed to try mediation. We’ll contact you with details of your appointment.'
    ]
  }
]

const mediationDQEnabledClaimDetails = [
  {
    status: 'Part admission - defendant part admits and rejects mediation DQs enabled - claimant rejects part admission',
    claim: partAdmissionClaim,
    claimOverride: {
      features: ['admissions', 'directionsQuestionnaire'],
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.NO
      },
      claimantResponse: {
        settleForAmount: 'no',
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: ['Wait for the court to review the case'],
    defendantAssertions: [partAdmissionClaim.claim.claimants[0].name + ' has rejected your admission of']
  },
  {
    status: 'Part admission - defendant part admits and accepts mediation DQs enabled - claimant rejects part admission with mediation',
    claim: partAdmissionClaim,
    claimOverride: {
      features: ['admissions', 'directionsQuestionnaire'],
      response: {
        ...baseResponseData,
        ...basePartialAdmissionData,
        freeMediation: FreeMediationOption.YES
      },
      claimantResponse: {
        settleForAmount: 'no',
        freeMediation: FreeMediationOption.YES,
        type: 'REJECTION'
      },
      claimantRespondedAt: MomentFactory.currentDate(),
      ...directionsQuestionnaireDeadline
    },
    claimantAssertions: ['Wait for the court to review the case'],
    defendantAssertions: [partAdmissionClaim.claim.claimants[0].name + ' has rejected your admission of']
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

          if (FeatureToggles.isEnabled('mediation')) {
            mediationDQEnabledClaimDetails.forEach(data => {
              it(`should render dashboard: ${data.status}`, async () => {
                draftStoreServiceMock.resolveFindNoDraftFound()
                claimStoreServiceMock.resolveRetrieveByClaimantId(data.claim, data.claimOverride)
                await request(app)
                  .get(Paths.dashboardPage.uri)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
              })
            })
          } else {
            legacyClaimDetails.forEach(data => {
              it(`should render dashboard: ${data.status}`, async () => {
                draftStoreServiceMock.resolveFindNoDraftFound()
                claimStoreServiceMock.resolveRetrieveByClaimantId(data.claim, data.claimOverride)
                await request(app)
                  .get(Paths.dashboardPage.uri)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
              })
            })
          }
        })

        context('as a defendant', () => {
          beforeEach(() => {
            claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList()
          })

          if (FeatureToggles.isEnabled('mediation')) {
            mediationDQEnabledClaimDetails.forEach(data => {
              it(`should render dashboard: ${data.status}`, async () => {
                draftStoreServiceMock.resolveFindNoDraftFound()
                claimStoreServiceMock.resolveRetrieveByClaimantId(data.claim, data.claimOverride)
                await request(app)
                  .get(Paths.dashboardPage.uri)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
              })
            })
          } else {
            legacyClaimDetails.forEach(data => {
              it(`should render dashboard: ${data.status}`, async () => {
                draftStoreServiceMock.resolveFindNoDraftFound()
                claimStoreServiceMock.resolveRetrieveByDefendantId(data.claim.referenceNumber, '1', data.claim, data.claimOverride)
                await request(app)
                  .get(Paths.dashboardPage.uri)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
              })
            })
          }
        })
      })
    })
  })
})
