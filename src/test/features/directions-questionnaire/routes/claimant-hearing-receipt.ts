import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Paths } from 'directions-questionnaire/paths'
import { app } from 'main/app'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = Paths.claimantReceiptReceiver.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Claimant response: confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when claimant click on download hearing requirements', () => {

        it('should call documentclient to download claimant hearing requirement', async () => {

          claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse()
          claimStoreServiceMock.resolveRetrieveDocument()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful)
        })
      })
    })
  })
})
