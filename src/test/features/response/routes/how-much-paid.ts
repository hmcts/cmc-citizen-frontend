import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkAlreadySubmittedGuard } from './checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { sampleClaimObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

const defendantHowMuchPaid = ResponsePaths.defendantHowMuchPaid.evaluateUri({ externalId: sampleClaimObj.externalId })
describe('Defendant response: how much have you paid', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', defendantHowMuchPaid)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', defendantHowMuchPaid)

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(defendantHowMuchPaid)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(defendantHowMuchPaid)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('How much have you paid the claimant?'))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', defendantHowMuchPaid)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', defendantHowMuchPaid)

      context('when response not submitted', () => {
        context('when form is invalid', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(defendantHowMuchPaid)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(defendantHowMuchPaid)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('How much have you paid the claimant?', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when form is valid and cannot save draft', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.rejectSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(defendantHowMuchPaid)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ amount: 300, date: { year: '1978', month: '1', day: '11' }, text: 'I don’t owe any money' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to timeline page when form is valid and everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(defendantHowMuchPaid)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ amount: 300, date: { year: '1978', month: '1', day: '11' }, text: 'I don’t owe any money' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(
                  ResponsePaths.timelinePage.evaluateUri({ externalId: sampleClaimObj.externalId })
                )
              )
          })
        })
      })
    })
  })
})
