import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { sampleClaimObj } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant response: incomplete submission page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      draftStoreServiceMock.resolveRetrieve('response')
      claimStoreServiceMock.resolveRetrieveClaimByExternalId()

      await request(app)
        .get(ResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: sampleClaimObj.externalId }))
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful
          .withText('You need to complete all sections before you submit your response'))
    })
  })
})
