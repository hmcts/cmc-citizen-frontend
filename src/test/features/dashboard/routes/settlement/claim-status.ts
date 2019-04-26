import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { sampleClaimDraftObj } from 'test/http-mocks/draft-store'
import * as data from 'test/features/dashboard/routes/settlement/data'

const cookieName: string = config.get<string>('session.cookieName')
const externalId: string = sampleClaimDraftObj.externalId

const claimantPagePath = Paths.claimantPage.evaluateUri({ externalId })
const defendantPagePath = Paths.defendantPage.evaluateUri({ externalId })

interface TestContext {
  party: string
  id: string
  url: string
}

const claimantContext: TestContext = {
  party: 'claimant',
  id: claimStoreServiceMock.sampleClaimObj.submitterId,
  url: claimantPagePath
}

const defendantContext: TestContext = {
  party: 'defendant',
  id: claimStoreServiceMock.sampleClaimObj.defendantId,
  url: defendantPagePath
}

const bothParties = [claimantContext, defendantContext]

describe('settlement claim statuses', () => {
  beforeEach(() => app.locals.csrf = 'dummy-token')

  context('Settlement reached', () => {
    bothParties.forEach(test => {
      context(test.party, () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(test.id, 'citizen')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({
            ...data.claim,
            ...data.partialAdmission,
            ...data.payBySetDateSettlementReachedPartyStatements
          })
        })

        it('should show settled dashboard status', async () => {
          await request(app)
            .get(test.url)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(
              'You’ve both signed a settlement agreement',
              'Download the settlement agreement'
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
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({
            ...data.claim,
            ...data.partialAdmission,
            ...data.claimantResponses.acceptBySettlement,
            ...data.nonMonetaryOfferSettlementReachedPartyStatements
          })

          await request(app)
            .get(test.url)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(
              'Agreement signed',
              'You’ve both signed a legal agreement. The claim is now settled.',
              'Download the settlement agreement'
            ))
        })
      })
    })
  })

  context('Settlement agreement rejected', () => {
    beforeEach(() => {
      claimStoreServiceMock.resolveRetrieveClaimByExternalId({
        ...data.claim,
        ...data.partialAdmission,
        ...data.claimantResponses.acceptWithNewPlan,
        ...data.defendantRejectsSettlementPartyStatements
      })
    })

    context(claimantContext.party, () => {
      it('should show settlement rejected dashboard status', async () => {
        idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen')

        await request(app)
          .get(claimantContext.url)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            'The defendant has rejected your settlement agreement',
            'You can request a County Court Judgment (CCJ) against them',
            'Request a County Court Judgment (CCJ)'
          ))
      })
    })

    context(defendantContext.party, () => {
      it('should show settlement rejected dashboard status', async () => {
        idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen')

        const claimantName = claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name
        await request(app)
          .get(defendantContext.url)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            'You rejected the settlement agreement',
            `${claimantName} can request a County Court Judgment (CCJ) against you`,
            'Download your response'
          ))
      })
    })
  })

  context('Claimant accepted court plan settlement', () => {
    beforeEach(() => {
      claimStoreServiceMock.resolveRetrieveClaimByExternalId({
        ...data.claim,
        ...data.partialAdmission,
        ...data.claimantResponses.acceptsWithCourtPlan,
        ...data.claimantAcceptsCourtOfferPartyStatements
      })
    })

    it(claimantContext.party, async () => {
      idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen')

      const defendantName = claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name
      await request(app)
        .get(claimantContext.url)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(
          'You’ve signed a settlement agreement',
          `We’ve emailed ${defendantName} the repayment plan and the settlement agreement for them to sign.`,
          'If they do not respond you can request a County Court Judgment.'
        ))
    })

    it(defendantContext.party, async () => {
      idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen')

      await request(app)
        .get(defendantContext.url)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(
          'They asked you to sign a settlement agreement to formalise the plan.',
          'If you sign the agreement, they can’t request a County Court Judgment against you unless you break the terms.',
          'View the repayment plan'
        ))
    })
  })
})
