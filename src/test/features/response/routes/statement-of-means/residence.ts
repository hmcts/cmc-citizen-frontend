import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../../routes/hooks'
import { checkAuthorizationGuards } from '../checks/authorization-check'

import * as idamServiceMock from '../../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { app } from '../../../../../main/app'

const cookieName: string = config.get<string>('session.cookieName')

const whatYouNeedPage = Paths.residencePage.evaluateUri({
  externalId: claimStoreServiceMock.sampleClaimObj.externalId
})

describe('Statement of means', () => {
  describe('Residence page', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {
      checkAuthorizationGuards(app, 'get', whatYouNeedPage)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
        })

        it('should return error page when unable to retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error')

          await request(app)
            .get(whatYouNeedPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return error page when unable to retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind()

          await request(app)
            .get(whatYouNeedPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return successful response when claim is retrieved', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(whatYouNeedPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Where are you living?'))
        })
      })
    })
  })
})
