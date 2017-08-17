import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as pdfServiceMock from '../../../http-mocks/pdf-service'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant response: receipt', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.receiptReceiver.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      it('should return 500 and render error page when cannot retrieve claim by defendant id', async () => {
        claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error')

        await request(app)
          .get(ResponsePaths.receiptReceiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve claim by defendant id', async () => {
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        claimStoreServiceMock.rejectRetrieveResponseByDefendantId('HTTP error')

        await request(app)
          .get(ResponsePaths.receiptReceiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot generate PDF', async () => {
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        claimStoreServiceMock.resolveRetrieveResponsesByDefendantId()
        pdfServiceMock.rejectGenerate('HTTP error')

        await request(app)
          .get(ResponsePaths.receiptReceiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return receipt when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
        claimStoreServiceMock.resolveRetrieveResponsesByDefendantId()
        pdfServiceMock.resolveGenerate()

        await request(app)
          .get(ResponsePaths.receiptReceiver.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful)
      })
    })
  })
})
