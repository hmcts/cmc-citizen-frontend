import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'
import { Paths as CCJPaths } from 'ccj/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/dashboard/routes/checks/authorization-check'

import { sampleClaimDraftObj } from 'test/http-mocks/draft-store'
import { company, individual, organisation, soleTrader } from 'test/data/entity/party'
import { ResponseMethod } from 'claims/models/response/responseMethod'

const cookieName: string = config.get<string>('session.cookieName')

const draftPagePath = Paths.claimantPage.evaluateUri({ externalId: 'draft' })
const claimPagePath = Paths.claimantPage.evaluateUri({ externalId: sampleClaimDraftObj.externalId })

describe('Dashboard - claimant page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', claimPagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when claim is in draft stage', () => {
        it('should render page when everything is fine', async () => {
          await request(app)
            .get(draftPagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Claim number', 'Draft'))
        })
      })

      context('when claim is not in draft stage', () => {
        it('should return 500 and render error page when cannot retrieve claims', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(claimPagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(claimPagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Claim number', claimStoreServiceMock.sampleClaimObj.referenceNumber))
        })

        it('should render page with proper status message when claim is in Business Queue state and paper response is reviewed: N9 form', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ state: 'BUSINESS_QUEUE', claimDocumentCollection: claimStoreServiceMock.paperResponseForm })

          await request(app)
            .get(claimPagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('We have received forms relating to your claim', 'Your claim will now continue offline', 'County Court Business Centre will contact you by post within 10 days to tell you what happens next'))
        })

        it('should render page with proper status message when claim is in Business Queue and there is no paper response review', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({ state: 'BUSINESS_QUEUE' })

          await request(app)
            .get(claimPagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('We’ve sent this claim and all related documents to the County Court Business Centre'))
        })

        it('should render page when everything is fine and not show download defendant responds when response is via ocon9x', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({
            response: {
              responseType: 'FULL_DEFENCE',
              responseMethod: ResponseMethod.OCON_FORM
            }
          })
          await request(app)
            .get(claimPagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withoutText('Defendant response:', 'Download response'))
        })

        it('should render page when everything is fine and show download defendant responds if its online response', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({
            response: {
              responseType: 'FULL_DEFENCE',
              responseMethod: ResponseMethod.DIGITAL
            }
          })
          await request(app)
            .get(claimPagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Defendant response:', 'Download response'))
        })

        context('when accessor is not the claimant', () => {
          it('should return forbidden', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({
              submitterId: claimStoreServiceMock.sampleClaimObj.defendantId,
              defendantId: claimStoreServiceMock.sampleClaimObj.submitterId
            })

            await request(app)
              .get(claimPagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.forbidden)
          })
        })
      })
    })
  })
  describe('on POST for requesting a CCJ', () => {
    checkAuthorizationGuards(app, 'post', claimPagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when claim is in draft stage', () => {
        it(`should render error page`, async () => {
          await request(app)
            .post(draftPagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error', 'Draft external ID is not supported'))
        })
      })

      context('when claim is not in draft stage', () => {
        context('when accessor is not the claimant', () => {
          it('should return forbidden', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({
              submitterId: claimStoreServiceMock.sampleClaimObj.defendantId,
              defendantId: claimStoreServiceMock.sampleClaimObj.submitterId
            })

            await request(app)
              .post(claimPagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.forbidden)
          })
        })

        context('when defendant is an individual', () => {
          it('should redirect to CCJ / defendant date of birth page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({
              claim: {
                ...claimStoreServiceMock.sampleClaimObj.claim,
                defendants: [individual]
              }
            })

            await request(app)
              .post(claimPagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect.toLocation(
                CCJPaths.dateOfBirthPage.evaluateUri({ externalId: sampleClaimDraftObj.externalId })
              ))
          })
        })

        context('when defendant is not an individual', () => {
          [soleTrader, company, organisation].forEach(party => {
            it(`should redirect to CCJ paid amount page when defendant is ${party.type}`, async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                claim: {
                  ...claimStoreServiceMock.sampleClaimObj.claim,
                  defendants: [party]
                }
              })

              await request(app)
                .post(claimPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.redirect.toLocation(
                  CCJPaths.paidAmountPage.evaluateUri({ externalId: sampleClaimDraftObj.externalId })
                ))
            })
          })
        })
      })
    })
  })
})
