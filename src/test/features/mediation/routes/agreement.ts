import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Paths } from 'mediation/paths'
import { app } from 'main/app'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = Paths.mediationAgreementDocument.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const claimWithDQ = {
  ...claimStoreServiceMock.sampleClaimObj,
  ...{ features: ['mediation'] }
}

describe('Free Mediation: download agreement', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {

    context('when claimant authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when claimant click on download hearing requirements', () => {

        it('should call documentclient to download mediation agreement', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
          claimStoreServiceMock.resolveRetrieveDocument()
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful)
        })
      })
    })

    context('when defendant authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when defendant click on download mediation agreement', () => {

        it('should call documentclient to download mediation agreement', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)
          claimStoreServiceMock.resolveRetrieveDocument()
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful)
        })
      })
    })
  })
})
