import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import { attachDefaultHooks } from 'test/routes/hooks'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import * as data from 'test/data/entity/settlement'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = Paths.dashboardPage.uri

interface TestContext {
  party: string
  id: string
  ownMock: (override: any) => void
  otherMock: () => void
}

const claimantContext: TestContext = {
  party: 'claimant',
  id: claimStoreServiceMock.sampleClaimObj.submitterId,
  ownMock: claimStoreServiceMock.resolveRetrieveByClaimantId,
  otherMock: claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList
}

const defendantContext: TestContext = {
  party: 'defendant',
  id: claimStoreServiceMock.sampleClaimObj.defendantId,
  ownMock: override => claimStoreServiceMock.resolveRetrieveByDefendantId(
    claimStoreServiceMock.sampleClaimObj.referenceNumber,
    this.id,
    override
  ),
  otherMock: claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList
}

const bothParties = [claimantContext, defendantContext]

describe('settlement dashboard statuses', () => {
  attachDefaultHooks(app)

  beforeEach(() => draftStoreMock.resolveFindNoDraftFound())

  context('Settlement reached', () => {
    bothParties.forEach(test => {
      context(test.party, () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(test.id, 'citizen')
          test.ownMock({
            ...data.claim,
            ...data.partialAdmission,
            ...data.payBySetDateSettlementReachedPartyStatements
          })
          test.otherMock()
        })

        it('should show settled dashboard status', async () => {
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(
              'You’ve both signed a settlement agreement.'
            ))
        })
      })
    })
  })

  context('Offer settlement reached', () => {
    bothParties.forEach(test => {
      context(test.party, () => {
        it('should show offer settlement reached dashboard status', async () => {
          idamServiceMock.resolveRetrieveUserFor(test.id, 'citizen')
          test.ownMock({
            ...data.claim,
            ...data.partialAdmission,
            ...data.claimantResponses.acceptBySettlement,
            ...data.nonMonetaryOfferSettlementReachedPartyStatements
          })
          test.otherMock()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(
              'You’ve both signed a legal agreement.',
              'The claim is now settled.'
            ))
        })
      })
    })
  })

  context('Settlement agreement rejected', () => {
    const override = {
      ...data.claim,
      ...data.partialAdmission,
      ...data.claimantResponses.acceptWithNewPlan,
      ...data.defendantRejectsSettlementPartyStatements
    }

    context(claimantContext.party, () => {
      beforeEach(() => {
        claimantContext.ownMock(override)
        claimantContext.otherMock()
        idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen')
      })

      it('should show settlement rejected dashboard status', async () => {
        const defendantName = claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            defendantName + ' has rejected your settlement agreement',
            'You can request a County Court Judgment against them'
          ))
      })
    })

    context(defendantContext.party, () => {
      beforeEach(() => {
        defendantContext.ownMock(override)
        defendantContext.otherMock()
        idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen')
      })

      it('should show settlement rejected dashboard status', async () => {
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            'You rejected the settlement agreement'
          ))
      })
    })
  })

  context('Claimant accepted court plan settlement', () => {
    const override = {
      ...data.claim,
      ...data.partialAdmission,
      ...data.claimantResponses.acceptsWithCourtPlan,
      ...data.claimantAcceptsCourtOfferPartyStatements
    }

    context(claimantContext.party, () => {
      beforeEach(() => {
        claimantContext.ownMock(override)
        claimantContext.otherMock()
        idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen')
      })

      it('should show settlement agreement signed and pending countersignature status', async () => {
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            'You’ve signed a settlement agreement.',
            'The defendant can choose to sign it or not.'
          ))
      })
    })

    context(defendantContext.party, () => {
      beforeEach(() => {
        defendantContext.ownMock(override)
        defendantContext.otherMock()
        idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen')
      })

      it('should show settlement agreement signed and pending countersignature status', async () => {
        const claimantName = claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name
        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            claimantName + ' asked you to sign a settlement agreement'
          ))
      })
    })
  })
})
