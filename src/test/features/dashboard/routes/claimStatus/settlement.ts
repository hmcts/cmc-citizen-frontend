import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { sampleClaimDraftObj } from 'test/http-mocks/draft-store'
import * as data from 'test/data/entity/settlement'
import { FeatureToggles } from 'utils/featureToggles'
import { MomentFactory } from 'shared/momentFactory'

const cookieName: string = config.get<string>('session.cookieName')
const externalId: string = sampleClaimDraftObj.externalId

const claimantPagePath = Paths.claimantPage.evaluateUri({ externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId })

const claimantContext = {
  party: 'claimant',
  id: claimStoreServiceMock.sampleClaimObj.submitterId,
  url: claimantPagePath
}

const defendantContext = {
  party: 'defendant',
  id: claimStoreServiceMock.sampleClaimObj.defendantId,
  url: defendantPagePath
}

const claimantName = claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name
const defendantName = claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name

const testData = [
  {
    status: 'Should show case settled when part-admit pay-by-set-date settlement reached',
    claim: {
      ...data.claim,
      ...data.responses.partialAdmission,
      ...data.payBySetDateSettlementReachedPartyStatements
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement'
    ]
  },
  {
    status: 'Should show case settled when full-admit pay-by-set-date settlement reached',
    claim: {
      ...data.claim,
      ...data.responses.fullAdmission,
      ...data.payBySetDateSettlementReachedPartyStatements
    },
    claimantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement'
    ],
    defendantAssertions: [
      'You’ve both signed a settlement agreement',
      'Download the settlement agreement'
    ]
  },
  {
    status: 'Should show offer settlement reached',
    claim: {
      ...data.claim,
      ...data.responses.partialAdmission,
      ...data.claimantResponses.acceptBySettlement,
      ...data.nonMonetaryOfferSettlementReachedPartyStatements
    },
    claimantAssertions: [
      'Agreement signed',
      'You’ve both signed a legal agreement. The claim is now settled.',
      'Download the settlement agreement'
    ],
    defendantAssertions: [
      'Agreement signed',
      'You’ve both signed a legal agreement. The claim is now settled.',
      'Download the settlement agreement'
    ]
  },
  {
    status: 'Should show part-admit settlement rejected',
    claim: {
      ...data.claim,
      ...data.responses.partialAdmission,
      ...data.claimantResponses.acceptWithNewPlan,
      ...data.defendantRejectsSettlementPartyStatements
    },
    claimantAssertions: [
      'The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them',
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: [
      'You rejected the settlement agreement',
      `${claimantName} can request a County Court Judgment (CCJ) against you`,
      'Download your response'
    ]
  },
  {
    status: 'Should show full-admit settlement rejected',
    claim: {
      ...data.claim,
      ...data.responses.fullAdmission,
      ...data.claimantResponses.acceptWithNewPlan,
      ...data.defendantRejectsSettlementPartyStatements
    },
    claimantAssertions: [
      'The defendant has rejected your settlement agreement',
      'You can request a County Court Judgment (CCJ) against them',
      'Request a County Court Judgment (CCJ)'
    ],
    defendantAssertions: [
      'You rejected the settlement agreement',
      `${claimantName} can request a County Court Judgment (CCJ) against you`,
      'Download your response'
    ]
  },
  {
    status: 'Should show claimant accepted court plan part-admit settlement',
    claim: {
      ...data.claim,
      ...data.responses.partialAdmission,
      ...data.claimantResponses.acceptsWithCourtPlan,
      ...data.claimantAcceptsCourtOfferPartyStatements
    },
    claimantAssertions: [
      'You’ve signed a settlement agreement',
      `We’ve emailed ${defendantName} the repayment plan and the settlement agreement for them to sign.`,
      'If they do not respond you can request a County Court Judgment.'
    ],
    defendantAssertions: [
      'They asked you to sign a settlement agreement to formalise the plan.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'View the repayment plan'
    ]
  },
  {
    status: 'Should show claimant accepted court plan full-admit settlement',
    claim: {
      ...data.claim,
      ...data.responses.fullAdmission,
      ...data.claimantResponses.acceptsWithCourtPlan,
      ...data.claimantAcceptsCourtOfferPartyStatements
    },
    claimantAssertions: [
      'You’ve signed a settlement agreement',
      `We’ve emailed ${defendantName} the repayment plan and the settlement agreement for them to sign.`,
      'If they do not respond you can request a County Court Judgment.'
    ],
    defendantAssertions: [
      'They asked you to sign a settlement agreement to formalise the plan.',
      'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
      'View the repayment plan'
    ]
  }
]

const legacyClaimDetails = [
  {
    status: 'Should show offer to settle made',
    claim: {
      ...data.claim,
      ...data.responses.fullRejection,
      ...data.nonMonetaryOfferAwaitingClaimantResponsePartyStatements
    },
    claimantAssertions: [
      'The defendant has rejected your claim',
      'They said they dispute your claim.',
      'Your claim won’t proceed if you don’t complete and return the form before',
      `${claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name} has made an offer to settle out of court.`,
      'View and respond to the offer'
    ],
    defendantAssertions: [
      'Your response to the claim',
      'You’ve rejected the claim and said you don’t want to use mediation to solve it. You’ll have to go to a hearing.',
      'complete a directions questionnaire',
      'Your defence will be cancelled if you don’t complete and return the form before',
      'You made an offer to settle the claim out of court.',
      `${claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name} can accept or reject your offer.`
    ]
  }
]

const mediationDQEnabledClaimDetails = [
  {
    status: 'Should show offer to settle made',
    claim: {
      ...data.claim,
      ...data.responses.fullRejection,
      ...data.nonMonetaryOfferAwaitingClaimantResponsePartyStatements
    },
    claimantAssertions: [
      'Decide whether to proceed',
      'John Doe has rejected your claim.',
      'You need to decide whether to proceed with the claim. You need to respond before',
      'Your claim won’t continue if you don’t respond by then.',
      `${claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name} has made an offer to settle out of court.`,
      'View and respond to the offer'
    ],
    defendantAssertions: [
      'Wait for the claimant to respond',
      'You’ve rejected the claim.',
      'You said you don’t want to use mediation to solve it. You might have to go to a hearing.',
      'We’ll contact you when the claimant responds.',
      'You made an offer to settle the claim out of court.',
      `${claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name} can accept or reject your offer.`
    ]
  }
]

describe('Settlement claim statuses', () => {
  beforeEach(() => app.locals.csrf = 'dummy-token')

  if (FeatureToggles.isEnabled('mediation')) {
    mediationDQEnabledClaimDetails.forEach(data => {
      context(data.status, () => {
        it(claimantContext.party, async () => {
          idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen')
          claimStoreServiceMock.resolveRetrieveByExternalId(data.claim)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(claimantContext.url)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
        })

        it(defendantContext.party, async () => {
          idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen')
          claimStoreServiceMock.resolveRetrieveByExternalId(data.claim)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(defendantContext.url)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
        })
      })
    })
  } else {
    legacyClaimDetails.forEach(data => {
      context(data.status, () => {
        it(claimantContext.party, async () => {
          idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen')
          claimStoreServiceMock.resolveRetrieveByExternalId(data.claim)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(claimantContext.url)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
        })

        it(defendantContext.party, async () => {
          idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen')
          claimStoreServiceMock.resolveRetrieveByExternalId(data.claim)
          claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

          await request(app)
            .get(defendantContext.url)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
        })
      })
    })
  }

  testData.forEach(data => {
    context(data.status, () => {
      it(claimantContext.party, async () => {
        idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen')
        claimStoreServiceMock.resolveRetrieveByExternalId(data.claim)
        claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

        await request(app)
          .get(claimantContext.url)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
      })

      it(defendantContext.party, async () => {
        idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen')
        claimStoreServiceMock.resolveRetrieveByExternalId(data.claim)
        claimStoreServiceMock.mockNextWorkingDay(MomentFactory.parse('2019-07-01'))

        await request(app)
          .get(defendantContext.url)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
      })
    })
  })
})
