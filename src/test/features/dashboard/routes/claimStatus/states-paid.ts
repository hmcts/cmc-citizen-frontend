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

import {
  partialAdmissionAlreadyPaidData,
  partialAdmissionFromStatesPaidDefence,
  partialAdmissionFromStatesPaidWithMediationDefence
} from 'test/data/entity/responseData'

import {
  claimantRejectAlreadyPaid,
  claimantRejectAlreadyPaidWithMediation,
  directionsQuestionnaireDeadline,
  respondedAt
} from 'test/data/entity/fullDefenceData'
import { MediationOutcome } from 'claims/models/mediationOutcome'

function statesPaidClaim () {
  return {
    ...claimStoreServiceMock.sampleClaimObj,
    responseDeadline: MomentFactory.currentDate().add(1, 'days'),
    ...respondedAt()
  }
}

const cookieName: string = config.get<string>('session.cookieName')

const claimPagePath = Paths.claimantPage.evaluateUri({ externalId: statesPaidClaim().externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId: statesPaidClaim().externalId })

function testData () {
  return [
    {
      status: 'States paid defence - defendant paid what he believed he owed - claimant rejects',
      claim: statesPaidClaim(),
      claimOverride: {
        response: {
          ...partialAdmissionFromStatesPaidDefence
        },
        ...claimantRejectAlreadyPaid(),
        ...directionsQuestionnaireDeadline()
      },
      claimantAssertions: ['Wait for the court to review the case',
        'You’ve rejected John Doe’s response and said you want to take the case to court.',
        'The court will review the case. We’ll email you if we set a hearing date to tell you how to prepare.',
        'Download their response',
        'Tell us you’ve ended the claim'
      ],
      defendantAssertions: ['Wait for the court to review the case',
        'John Smith has rejected your admission of £100',
        'They said you didn’t pay them £100.',
        'You might have to go to a court hearing. We’ll contact you if we set a hearing date to tell you how to prepare.',
        'complete a directions questionnaire',
        'Download your response',
        'You must make sure we receive the form before 4pm on',
        'You also need to send a copy of the form to ' + statesPaidClaim().claim.claimants[0].name
      ]
    },
    {
      status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects',
      claim: statesPaidClaim(),
      claimOverride: {
        response: {
          ...partialAdmissionFromStatesPaidWithMediationDefence
        },
        ...claimantRejectAlreadyPaidWithMediation()
      },
      claimantAssertions: ['We’ll contact you to try to arrange a mediation appointment',
        'You’ve rejected the defendant’s response.',
        'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
        'Find out how mediation works'
      ],
      defendantAssertions: ['We’ll contact you to try to arrange a mediation appointment',
        'John Smith has rejected your defence.',
        'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
        'Find out how mediation works'
      ]
    },
    {
      status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - mediation failed',
      claim: statesPaidClaim(),
      claimOverride: {
        response: {
          ...partialAdmissionFromStatesPaidWithMediationDefence,
          directionsQuestionnaire: {
            hearingLoop: 'NO',
            selfWitness: 'NO',
            disabledAccess: 'NO',
            hearingLocation: 'Central London County Court',
            hearingLocationOption: 'SUGGESTED_COURT'
          }
        },
        ...claimantRejectAlreadyPaidWithMediation(),
        mediationOutcome: MediationOutcome.FAILED
      },
      claimantAssertions: [
        'Mediation was unsuccessful',
        'You weren’t able to resolve your claim against ' + statesPaidClaim().claim.defendants[0].name + ' using mediation.'
      ],
      defendantAssertions: [
        'Mediation was unsuccessful',
        'You weren’t able to resolve ' + statesPaidClaim().claim.claimants[0].name + '’s claim against you using mediation.',
        'Download ' + statesPaidClaim().claim.claimants[0].name + '’s hearing requirements'
      ]
    },
    {
      status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - DQs enabled',
      claim: statesPaidClaim(),
      claimOverride: {
        response: {
          ...partialAdmissionFromStatesPaidWithMediationDefence,
          directionsQuestionnaire: {
            hearingLoop: 'NO',
            selfWitness: 'NO',
            disabledAccess: 'NO',
            hearingLocation: 'Central London County Court',
            hearingLocationOption: 'SUGGESTED_COURT'
          }
        },
        ...claimantRejectAlreadyPaidWithMediation()
      },
      claimantAssertions: [
        'You’ve rejected the defendant’s response.',
        'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
        'Find out how mediation works'
      ],
      defendantAssertions: [
        statesPaidClaim().claim.claimants[0].name + ' has rejected your defence.',
        'You’ve both agreed to try mediation. We’ll contact you to try to arrange a call with the mediator.',
        'Find out how mediation works',
        'They’ve also sent us their hearing requirements.',
        'Download their hearing requirements'
      ]
    },
    {
      status: 'States paid defence with mediation - defendant paid what he believed he owed without mediation - claimant rejects - DQEnabled',
      claim: statesPaidClaim(),
      claimOverride: {
        response: {
          ...partialAdmissionAlreadyPaidData,
          directionsQuestionnaire: {
            hearingLoop: 'NO',
            selfWitness: 'NO',
            disabledAccess: 'NO',
            hearingLocation: 'Central London County Court',
            hearingLocationOption: 'SUGGESTED_COURT'
          }
        },
        ...claimantRejectAlreadyPaid()
      },
      claimantAssertions: [
        'You’ve rejected ' + statesPaidClaim().claim.defendants[0].name + '’s response and said you want to take the case to court.',
        'The court will review the case. We’ll email you if we set a hearing date to tell you how to prepare.'
      ],
      defendantAssertions: [
        'They said you didn’t pay them',
        'You might have to go to a court hearing.',
        'We’ll contact you if we set a hearing date to tell you how to prepare.',
        'Download your response',
        'They’ve also sent us their hearing requirements',
        'Download their hearing requirements'
      ]
    },
    {
      status: 'States paid defence with mediation - defendant paid what he believed he owed with mediation - claimant rejects - mediation success',
      claim: statesPaidClaim(),
      claimOverride: {
        response: {
          ...partialAdmissionFromStatesPaidWithMediationDefence
        },
        ...claimantRejectAlreadyPaidWithMediation(),
        ...directionsQuestionnaireDeadline(),
        mediationOutcome: MediationOutcome.SUCCEEDED
      },
      claimantAssertions: [
        'You settled the claim through mediation',
        'You made an agreement which means the claim is now ended and sets out the terms of how ' + statesPaidClaim().claim.defendants[0].name + ' must repay you.',
        'Download the agreement',
        '(PDF)'
      ],
      defendantAssertions: [
        'You settled the claim through mediation',
        'You made an agreement which means the claim is now ended and sets out the terms of how you must repay ' + statesPaidClaim().claim.claimants[0].name + '.',
        'Download the agreement',
        '(PDF)',
        'Contact ' + statesPaidClaim().claim.claimants[0].name,
        'if you need their payment details. Make sure you get receipts for any payments.'
      ]
    }
  ]
}

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
          })

          testData().forEach(data => {
            it(`should render claim status: ${data.status}`, async () => {
              claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)
              claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

              await request(app)
                .get(claimPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
            })
          })
        })

        context('as a defendant', () => {
          beforeEach(() => {
            idamServiceMock.resolveRetrieveUserFor('123', 'citizen')
          })

          testData().forEach(data => {
            it(`should render dashboard: ${data.status}`, async () => {
              claimStoreServiceMock.resolveRetrieveByExternalId(data.claim, data.claimOverride)
              await request(app)
                .get(defendantPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
            })
          })
        })
      })
    })
  })
})
