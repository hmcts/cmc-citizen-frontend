import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'dashboard/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/dashboard/routes/checks/authorization-check'

const cookieName: string = config.get<string>('session.cookieName')
const claimantDetailsPagePath = Paths.claimantDetailsPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' })
const defendantPage = Paths.defendantPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' })

describe('Dashboard - defendant page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', defendantPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(defendantPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when at least one claim issued', () => {
        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          await request(app)
            .get(defendantPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Claim number', claimStoreServiceMock.sampleClaimObj.referenceNumber))
        })

        it('should render claimant details', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(claimantDetailsPagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Claimant\'s details',
                                                                  'Name', 'John Smith',
                                                                  'Address', 'line1<br>line2<br>city<br>bb127nq',
                                                                  'Correspondence Address', 'Not available',
                                                                  'Email', 'Not available',
                                                                  'Telephone', 'Not available'))
        })

        it('should return forbidden when accessor is not the defendant', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({
            submitterId: claimStoreServiceMock.sampleClaimObj.defendantId,
            defendantId: claimStoreServiceMock.sampleClaimObj.submitterId
          })
          await request(app)
            .get(defendantPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.forbidden)
        })
      })
    })
  })
})
