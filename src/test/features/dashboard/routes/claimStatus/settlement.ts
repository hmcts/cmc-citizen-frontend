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
      ...data.partialAdmission,
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
      ...data.fullAdmission,
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
      ...data.partialAdmission,
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
      ...data.partialAdmission,
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
      ...data.fullAdmission,
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
      ...data.partialAdmission,
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
      ...data.fullAdmission,
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

describe('Settlement claim statuses', () => {
  beforeEach(() => app.locals.csrf = 'dummy-token')

  testData.forEach(data => {
    context(data.status, () => {
      it(claimantContext.party, async () => {
        idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen')
        claimStoreServiceMock.resolveRetrieveByExternalId(data.claim)

        await request(app)
          .get(claimantContext.url)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
      })

      it(defendantContext.party, async () => {
        idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen')
        claimStoreServiceMock.resolveRetrieveByExternalId(data.claim)

        await request(app)
          .get(defendantContext.url)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
      })
    })
  })
})
