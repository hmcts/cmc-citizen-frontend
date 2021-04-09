import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import * as data from 'test/data/entity/settlement'
import { attachDefaultHooks } from 'test/routes/hooks'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = Paths.dashboardPage.uri

const claimantContext = {
  party: 'claimant',
  id: claimStoreServiceMock.sampleClaimObj.submitterId,
  ownMock: claimStoreServiceMock.resolveRetrieveByClaimantId,
  otherMock: claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList
}

const defendantContext = {
  party: 'defendant',
  id: claimStoreServiceMock.sampleClaimObj.defendantId,
  ownMock: override => claimStoreServiceMock.resolveRetrieveByDefendantId(
    claimStoreServiceMock.sampleClaimObj.referenceNumber,
    this.id,
    override
  ),
  otherMock: claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList
}

function testData () {
  return [
    {
      status: 'Should show case settled when part-admit pay-by-set-date settlement reached',
      claim: {
        ...data.claim,
        ...data.responses().partialAdmission,
        ...data.payBySetDateSettlementReachedPartyStatements()
      },
      claimantAssertions: [
        'You’ve both signed a settlement agreement.'
      ],
      defendantAssertions: [
        'You’ve both signed a settlement agreement'
      ]
    },
    {
      status: 'Should show case settled when full-admit pay-by-set-date settlement reached',
      claim: {
        ...data.claim,
        ...data.responses().fullAdmission,
        ...data.payBySetDateSettlementReachedPartyStatements()
      },
      claimantAssertions: [
        'You’ve both signed a settlement agreement.'
      ],
      defendantAssertions: [
        'You’ve both signed a settlement agreement'
      ]
    },
    {
      status: 'Should show offer settlement reached',
      claim: {
        ...data.claim,
        ...data.responses().partialAdmission,
        ...data.claimantResponses().acceptBySettlement,
        ...data.nonMonetaryOfferSettlementReachedPartyStatements()
      },
      claimantAssertions: [
        'You’ve both signed a legal agreement.',
        'The claim is now settled.'
      ],
      defendantAssertions: [
        'You’ve both signed a legal agreement.',
        'The claim is now settled.'
      ]
    },
    {
      status: 'Should show part-admit settlement rejected',
      claim: {
        ...data.claim,
        ...data.responses().partialAdmission,
        ...data.claimantResponses().acceptWithNewPlan,
        ...data.defendantRejectsSettlementPartyStatements()
      },
      claimantAssertions: [
        `${claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name} has rejected your settlement agreement`,
        'You can request a County Court Judgment against them'
      ],
      defendantAssertions: [
        'You rejected the settlement agreement'
      ]
    },
    {
      status: 'Should show full-admit settlement rejected',
      claim: {
        ...data.claim,
        ...data.responses().fullAdmission,
        ...data.claimantResponses().acceptWithNewPlan,
        ...data.defendantRejectsSettlementPartyStatements()
      },
      claimantAssertions: [
        `${claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name} has rejected your settlement agreement`,
        'You can request a County Court Judgment against them'
      ],
      defendantAssertions: [
        'You rejected the settlement agreement'
      ]
    },
    {
      status: 'Should show claimant accepted court plan part-admit settlement',
      claim: {
        ...data.claim,
        ...data.responses().partialAdmission,
        ...data.claimantResponses().acceptsWithCourtPlan,
        ...data.claimantAcceptsCourtOfferPartyStatements()
      },
      claimantAssertions: [
        'You’ve signed a settlement agreement.',
        'The defendant can choose to sign it or not.'
      ],
      defendantAssertions: [
        `${claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name} asked you to sign a settlement agreement`
      ]
    },
    {
      status: 'Should show claimant accepted court plan full-admit settlement',
      claim: {
        ...data.claim,
        ...data.responses().fullAdmission,
        ...data.claimantResponses().acceptsWithCourtPlan,
        ...data.claimantAcceptsCourtOfferPartyStatements()
      },
      claimantAssertions: [
        'You’ve signed a settlement agreement.',
        'The defendant can choose to sign it or not.'
      ],
      defendantAssertions: [
        `${claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name} asked you to sign a settlement agreement`
      ]
    }
  ]
}

describe('Settlement dashboard statuses dashboard', () => {
  attachDefaultHooks(app)

  testData().forEach(data => {
    context(data.status, () => {
      beforeEach(() => {
        draftStoreMock.resolveFindNoDraftFound()
        claimStoreServiceMock.resolveRetrievePaginationInfoEmptyList()
        claimStoreServiceMock.resolveRetrievePaginationInfoEmptyList()
      })

      it(claimantContext.party, async () => {
        claimantContext.ownMock(data.claim)
        claimantContext.otherMock()
        idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(...data.claimantAssertions))
      })

      it(defendantContext.party, async () => {
        defendantContext.ownMock(data.claim)
        defendantContext.otherMock()
        idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(...data.defendantAssertions))
      })
    })
  })
})
