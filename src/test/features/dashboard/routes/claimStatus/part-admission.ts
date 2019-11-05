import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
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
import { MediationOutcome } from 'claims/models/mediationOutcome'

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
      'We’ll contact you to try to arrange a mediation appointment',
      'You rejected the defendant’s admission of ',
      'You’ve both agreed to try mediation. We’ll contact you to arrange a call with the mediator.',
      'Find out how mediation works'
    ],
    defendantAssertions: [
      partAdmissionClaim.claim.claimants[0].name + ' has rejected your admission of',
      'They believe you owe them the full ',
      'They have agreed to try mediation. We’ll contact you to try to arrange an appointment.'
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
    claimantAssertions: [
      'Wait for the court to review the case',
      'You’ve rejected ' + partAdmissionClaim.claim.defendants[0].name + '’s response and said you want to take the case to court.',
      'The court will review the case. We’ll contact you to tell you what to do next.'
    ],
    defendantAssertions: [
      partAdmissionClaim.claim.claimants[0].name + ' has rejected your admission of',
      'They believe you owe them the full ',
      'You might have to go to a hearing. We’ll contact you if we set a hearing date to tell you how to prepare.'
    ]
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
    claimantAssertions: [
      'We’ll contact you to try to arrange a mediation appointment',
      'You rejected the defendant’s admission of ',
      'You’ve both agreed to try mediation. We’ll contact you to arrange a call with the mediator.',
      'Find out how mediation works'
    ],
    defendantAssertions: [
      partAdmissionClaim.claim.claimants[0].name + ' has rejected your admission of',
      'They believe you owe them the full ',
      'They have agreed to try mediation. We’ll contact you to try to arrange an appointment.'
    ]
  },
  {
    status: 'Part admission - defendant part admits and accepts mediation DQs enabled - claimant rejects part admission with mediation - mediation failed',
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
      ...directionsQuestionnaireDeadline,
      mediationOutcome: MediationOutcome.FAILED
    },
    claimantAssertions: [
      'Mediation was unsuccessful',
      'You wheren’t able to resolve your claim against ' + partAdmissionClaim.claim.defendants[0].name + ' using mediation.',
      'You’ll have to go to a hearing. We’ll contact you with the details.'
    ],
    defendantAssertions: [
      'Mediation was unsuccessful',
      'You wheren’t able to resolve ' + partAdmissionClaim.claim.claimants[0].name + '’s claim against you using mediation.',
      'You’ll have to go to a hearing. We’ll contact you with the details.'
    ]
  },
  {
    status: 'Part admission - defendant part admits and accepts mediation DQs enabled - claimant rejects part admission with mediation - mediation success',
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
      ...directionsQuestionnaireDeadline,
      mediationOutcome: MediationOutcome.SUCCEEDED
    },
    claimantAssertions: [
      'You both agreed a settlement through mediation'
    ],
    defendantAssertions: [
      'You both agreed a settlement through mediation',
      'The claimant can’t request a County Court Judgment against you unless you break the terms',
      'Contact ' + partAdmissionClaim.claim.claimants[0].name,
      'if you need their payment details. Make sure you get receipts for any payments.'
    ]
  }
]

const claimPagePath = Paths.claimantPage.evaluateUri({ externalId: partAdmissionClaim.externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId: partAdmissionClaim.externalId })

describe('Dashboard page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', claimPagePath)
    checkAuthorizationGuards(app, 'get', defendantPagePath)

    context('when user authorised', () => {
      context('Claim Status', () => {
        context('as a claimant', () => {
          beforeEach(() => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
            claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-08-16'))
          })

          if (FeatureToggles.isEnabled('mediation')) {
            mediationDQEnabledClaimDetails.forEach(data => {
              it(`should render mediation or DQ status: ${data.status}`, async () => {
                claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

                await request(app)
                  .get(claimPagePath)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
              })
            })
          } else {
            legacyClaimDetails.forEach(data => {
              it(`should render legacy claim status: ${data.status}`, async () => {
                claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

                await request(app)
                  .get(claimPagePath)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
              })
            })
          }
        })

        context('as a defendant', () => {
          beforeEach(() => {
            idamServiceMock.resolveRetrieveUserFor('123', 'citizen')
          })

          if (FeatureToggles.isEnabled('mediation')) {
            mediationDQEnabledClaimDetails.forEach(data => {
              it(`should render mediation or DQ dashboard: ${data.status}`, async () => {
                claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

                await request(app)
                  .get(defendantPagePath)
                  .set('Cookie', `${cookieName}=ABC`)
                  .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
              })
            })
          } else {
            legacyClaimDetails.forEach(data => {
              it(`should render non mediation or DQ dashboard: ${data.status}`, async () => {
                claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)

                await request(app)
                  .get(defendantPagePath)
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
