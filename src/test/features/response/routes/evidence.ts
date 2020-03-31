import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { Paths } from 'response/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { generateString } from 'test/app/forms/models/validationUtils'
import { EvidenceType } from 'forms/models/evidenceType'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import { ResponseType } from 'response/form/models/responseType'
import {
  verifyRedirectForGetWhenAlreadyPaidInFull,
  verifyRedirectForPostWhenAlreadyPaidInFull
} from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.evidencePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: evidence', () => {

  attachDefaultHooks(app)

  describe('on GET', () => {

    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {

      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      context('when response and CCJ not submitted', () => {

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('List your evidence (optional)'))
        })
      })
    })
  })

  describe('on POST', () => {

    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    describe('for authorized user', () => {

      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
      verifyRedirectForPostWhenAlreadyPaidInFull(pagePath)

      describe('errors are handled properly', () => {

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      describe('submit form', () => {

        context('valid form should redirect to', () => {

          it('impactOfDisputePage when it is not FULL DEFENCE', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response', { response: { type: ResponseType.PART_ADMISSION } })
            draftStoreServiceMock.resolveUpdate(100)
            draftStoreServiceMock.resolveFind('mediation')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ rows: [{ type: EvidenceType.CONTRACTS_AND_AGREEMENTS.value, description: 'Bla bla' }] })
              .expect(res => expect(res).to.be.redirect
                .toLocation(Paths.impactOfDisputePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('taskListPage when it is FULL DEFENCE', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveUpdate(100)
            draftStoreServiceMock.resolveFind('mediation')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ rows: [{ type: EvidenceType.CONTRACTS_AND_AGREEMENTS.value, description: 'Bla bla' }] })
              .expect(res => expect(res).to.be.redirect
                .toLocation(Paths.taskListPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('taskListPage when it is PART ADMISSION', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response:partial-admission', { response: { type: ResponseType.PART_ADMISSION } })
            draftStoreServiceMock.resolveUpdate(100)
            draftStoreServiceMock.resolveFind('mediation')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ rows: [{ type: EvidenceType.CONTRACTS_AND_AGREEMENTS.value, description: 'Bla bla' }] })
              .expect(res => expect(res).to.be.redirect
                .toLocation(Paths.taskListPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })

        context('invalid form', () => {

          it('should render page when description too long', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveFind('mediation')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({
                rows: [{
                  type: EvidenceType.CONTRACTS_AND_AGREEMENTS.value,
                  description: generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
                }]
              })
              .expect(res => expect(res).to.be.successful.withText('You’ve entered too many characters'))
          })
        })
      })

      describe('add row action', () => {

        it('should render page when valid input', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveFind('mediation')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { addRow: 'Add row' } })
            .expect(res => expect(res).to.be.successful.withText('List your evidence (optional)'))
        })
      })
    })
  })
})
