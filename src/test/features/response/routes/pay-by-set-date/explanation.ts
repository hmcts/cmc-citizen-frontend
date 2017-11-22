import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../../routes/hooks'
import { checkAuthorizationGuards } from '../checks/authorization-check'
import { checkAlreadySubmittedGuard } from '../checks/already-submitted-check'

import { PayBySetDatePaths, Paths, StatementOfMeansPaths } from 'response/paths'

import { app } from '../../../../../main/app'

import * as idamServiceMock from '../../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from '../checks/ccj-requested-check'
import { ValidationErrors } from 'response/form/models/pay-by-set-date/explanation'
import { PartyType } from 'app/common/partyType'

const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const statementOfMeansStartPage = StatementOfMeansPaths.startPage.evaluateUri({ externalId: externalId })
const taskListPage = Paths.taskListPage.evaluateUri({ externalId: externalId })

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = PayBySetDatePaths.explanationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Pay by set date : explanation', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      checkAlreadySubmittedGuard(app, 'get', pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, 'get', pagePath)

      context('when guards are satisfied', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        it('should render error page when unable to retrieve draft', async () => {
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Explain why you can’t pay now'))
        })
      })
    })
  })

  describe('on POST', () => {
    const validFormData = {
      text: 'I am a valid explanation'
    }

    checkAuthorizationGuards(app, 'post', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      checkAlreadySubmittedGuard(app, 'post', pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, 'post', pagePath)

      context('when guards are satisfied', () => {
        it('should render error page when unable to retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render error page when unable to save draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.rejectSave()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should trigger validation when invalid data is given', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ text: '' })
            .expect(res => expect(res).to.be.successful.withText(ValidationErrors.EXPLAIN_WHY_YOU_CANT_PAY_NOW))
        });

        [PartyType.INDIVIDUAL, PartyType.SOLE_TRADER_OR_SELF_EMPLOYED].forEach((partyType) => {
          it(`should redirect to statement of means start page if defendant is ${partyType.value}`, async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({
              claim: {
                defendants: [
                  {
                    type: partyType.value
                  }
                ]
              }
            })
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(statementOfMeansStartPage))
          })
        });

        [PartyType.COMPANY, PartyType.ORGANISATION].forEach((partyType) => {
          it(`should redirect to task list page if defendant is ${partyType.value}`, async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({
              claim: {
                defendants: [
                  {
                    type: partyType.value
                  }
                ]
              }
            })
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(taskListPage))
          })
        })
      })
    })
  })
})
