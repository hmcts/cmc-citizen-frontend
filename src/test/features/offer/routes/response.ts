import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { app } from 'main/app'
import { Paths as OfferPaths } from 'offer/paths'
import { StatementType } from 'offer/form/models/statementType'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/offer/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'
const responsePage = OfferPaths.responsePage.evaluateUri({ externalId: externalId })
const makeLegalAgreementPage = OfferPaths.makeAgreementPage.evaluateUri({ externalId: externalId })
const rejectedOfferPage = OfferPaths.rejectedPage.evaluateUri({ externalId: externalId })

describe('defendant response page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', responsePage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(responsePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        await request(app)
          .get(responsePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Do you accept the offer?'))
      })

      it('should redirect to claimant dashboard uri', async () => {
        claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId()
        await request(app)
          .get(responsePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect)
      })
    })

    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', responsePage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'defendant')
        })

        context('when middleware failure', () => {

          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(responsePage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({})
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is valid', async () => {

          it('should redirect to make a legal agreement page when offer is accepted', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            const formData = {
              option: StatementType.ACCEPTATION.value
            }
            await request(app)
              .post(responsePage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(formData)
              .expect(res => expect(res).to.be.redirect.toLocation(makeLegalAgreementPage))
          })

          it('should submit rejection and redirect to confirmation page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.resolveRejectOffer()
            const formData = {
              option: StatementType.REJECTION.value
            }
            await request(app)
              .post(responsePage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(formData)
              .expect(res => expect(res).to.be.redirect.toLocation(rejectedOfferPage))
          })

          it('should thorw error when neither accepted or rejected', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            const formData = {
              option: StatementType.OFFER.value
            }
            await request(app)
              .post(responsePage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(formData)
              .expect(res => expect(res).to.be.serverError.withText('not supported'))
          })
        })

        context('when form is invalid', async () => {

          it('should render page with errors', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            const formData = {
              option: undefined
            }
            await request(app)
              .post(responsePage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(formData)
              .expect(res => expect(res).to.be.successful.withText('Choose option: yes or no or make an offer', 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
