import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse()

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response'))
      })

      it('when part admit pay immediately should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyData)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'You’ve said you owe £3,000 and offered to pay John Smith immediately.',
            'We’ll contact you when they respond.',
            'You need to pay John Smith £3,000 immediately.',
            'Make sure that:',
            'they get the money by 23 July 2019 - they can request a County Court Judgment against you if not',
            'any cheques or bank transfers are clear in their account by the deadline',
            'you get a receipt for any payments',
            'if you need their payment details.',
            'If John Smith accepts your offer of £3,000',
            'The claim will be settled.',
            'If John Smith rejects your offer',
            'The court will review the case for the full amount of £200.'
          ))
      })

      it('when part admit pay by set date without mediation should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'You believe you owe £3,000. We’ve emailed John Smith your offer to pay this amount by 31 December 2050.',
            'We’ve also sent them your explanation of why you don’t believe you owe the amount claimed.',
            'We’ll contact you when they respond.',
            'If John Smith accepts your offer',
            'You should:',
            'pay John Smith by 31 December 2050',
            'make sure any cheques or bank transfers are clear in their account by the deadline',
            'if you need their payment details',
            'make sure you get a receipt for your payment',
            'Because you’ve said you won’t pay immediately, John Smith can either:',
            'ask you to sign a settlement agreement to formalise the repayment plan',
            'request a County Court Judgment against you for the amount that you have admitted',
            'If John Smith rejects that you only owe £3,000',
            'The court will review the case for the full amount of £200.',
            'If John Smith rejects your offer to pay by 31 December 2050',
            'The court will decide how you must pay.'
          ))
      })

      it('when part admit pay by set date with mediation should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateWithMediationResponseObj)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'You believe you owe £3,000. We’ve emailed John Smith your offer to pay this amount by 31 December 2050.',
            'We’ve also sent them your explanation of why you don’t believe you owe the amount claimed.',
            'We’ll contact you when they respond.',
            'If John Smith accepts your offer',
            'You should:',
            'pay John Smith by 31 December 2050',
            'make sure any cheques or bank transfers are clear in their account by the deadline',
            'if you need their payment details',
            'make sure you get a receipt for your payment',
            'Because you’ve said you won’t pay immediately, John Smith can either:',
            'ask you to sign a settlement agreement to formalise the repayment plan',
            'request a County Court Judgment against you for the amount that you have admitted',
            'If John Smith rejects that you only owe £3,000',
            'We’ll ask if they want to try mediation. If they agree, we’ll contact you with an appointment.',
            'If they don’t want to try mediation the court will review the case for the full amount of £200.',
            'The court will decide how you must pay.'
          ))
      })

      it('when part admit pay by instalments with mediation should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentByInstalmentWithMediationResponseObj)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'You believe you owe £3,000. We’ve emailed John Smith your offer to pay this amount by instalments.',
            'We’ve also sent them your explanation of why you don’t believe you owe the amount claimed.',
            'We’ll contact you when they respond.',
            'If John Smith accepts your offer',
            'You should:',
            'set up your repayment plan to begin when you said it would',
            'if you need their payment details',
            'make sure you get a receipt for any payments',
            'Because you’ve said you won’t pay immediately, John Smith can either:',
            'ask you to sign a settlement agreement to formalise the repayment plan',
            'request a County Court Judgment against you for the amount that you have admitted',
            'If John Smith rejects that you only owe £3,000',
            'We’ll ask if they want to try mediation. If they agree, we’ll contact you with an appointment.',
            'If they don’t want to try mediation the court will review the case for the full amount of £200.',
            'If John Smith rejects your offer to pay in instalments',
            'The court will decide how you must pay.'
          ))
      })

      it('when part admit pay by instalments without mediation should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentByInstalmentDateResponseObj)

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('You’ve submitted your response',
            'You believe you owe £3,000. We’ve emailed John Smith your offer to pay this amount by instalments.',
            'We’ve also sent them your explanation of why you don’t believe you owe the amount claimed.',
            'We’ll contact you when they respond.',
            'If John Smith accepts your offer',
            'You should:',
            'set up your repayment plan to begin when you said it would',
            'if you need their payment details',
            'make sure you get a receipt for any payments',
            'Because you’ve said you won’t pay immediately, John Smith can either:',
            'ask you to sign a settlement agreement to formalise the repayment plan',
            'request a County Court Judgment against you for the amount that you have admitted',
            'If John Smith rejects that you only owe £3,000',
            'The court will review the case for the full amount of £200.',
            'If John Smith rejects your offer to pay in instalments',
            'The court will decide how you must pay.'
          ))
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('internal service error when retrieving response')

        await request(app)
          .get(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })
    })
  })
})
