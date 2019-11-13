import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Paths as ResponsePaths } from 'response/paths'
import { app } from 'main/app'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = ResponsePaths.claimantDQs.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Mediation unsuccessful - Claim details page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimIssueObj.submitterId, 'citizen')
      })

      context('when defendant clicks on claimant hearing requirements', () => {

        it('should call documentclient to download claimant hearing requirement', async () => {
          draftStoreServiceMock.resolveFind('response')
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
