import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import { checkAuthorizationGuards } from './checks/authorization-check'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

import { Paths } from 'statement-of-means/paths'
import { app } from '../../../../main/app'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = Paths.startPage.evaluateUri({
  externalId: claimStoreServiceMock.sampleClaimObj.externalId
})

describe('Statement of means', () => {
  describe('Start page', () => {
    attachDefaultHooks(app)

    describe('on GET', () => {
      checkAuthorizationGuards(app, 'get', pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
        })

        it('should return successful response when claim is retrieved', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText(
              'You need to answer some financial questions',
              `Your answers will be sent to ${claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name}`
            ))
        })
      })
    })
  })
})
