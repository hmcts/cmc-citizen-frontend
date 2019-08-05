import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { app } from 'main/app'
import { Paths as OfferPaths } from 'offer/paths'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/offer/routes/checks/authorization-check'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'claims/models/madeBy'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'
const declarationPage = OfferPaths.declarationPage.evaluateUri({ externalId: externalId })
const acceptedPage = OfferPaths.acceptedPage.evaluateUri({ externalId: externalId })
const settledPage = OfferPaths.settledPage.evaluateUri({ externalId: externalId })
const pageHeading: string = 'Sign a settlement agreement'

describe('declaration page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', declarationPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(declarationPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        await request(app)
          .get(declarationPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageHeading))
      })
    })

    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', declarationPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'defendant')
        })

        context('when middleware failure', () => {
          it('should return 500 when cannot retrieve claim by external id', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(declarationPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({})
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })
        })

        context('when form is valid', () => {
          context('when accepting offer as claimant', () => {
            it('should accepted offer and redirect to confirmation page', async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId()
              claimStoreServiceMock.resolveAcceptOffer()
              const formData = {
                signed: 'true'
              }
              await request(app)
                .post(declarationPage)
                .set('Cookie', `${cookieName}=ABC`)
                .send(formData)
                .expect(res => expect(res).to.be.redirect.toLocation(acceptedPage))
            })
          })

          context('when countersigning offer as defendant', () => {
            const override: object = {
              submitterId: '123',
              defendantId: '1',
              settlement: {
                partyStatements: [
                  {
                    type: StatementType.OFFER.value,
                    madeBy: MadeBy.DEFENDANT.value,
                    offer: { content: 'offer text', completionDate: '2017-08-08' }
                  },
                  {
                    type: StatementType.ACCEPTATION.value,
                    madeBy: MadeBy.CLAIMANT.value
                  }
                ]
              }
            }
            it('should countersign offer and redirect to confirmation page when offer accepted by claimant', async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(override)
              claimStoreServiceMock.resolveCountersignOffer()
              await request(app)
                .post(declarationPage)
                .set('Cookie', `${cookieName}=ABC`)
                .send({ signed: 'true' })
                .expect(res => expect(res).to.be.redirect.toLocation(settledPage))
            })
          })
        })

        context('when form is invalid', async () => {
          it('should render page with errors', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            const formData = {
              signed: undefined
            }
            await request(app)
              .post(declarationPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(formData)
              .expect(res => expect(res).to.be.successful.withText('Please select I confirm I’ve read and accept the terms of the agreement.', 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
