import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import {
  resolveRetrieveClaimByExternalId,
  rejectRetrieveClaimByExternalId,
  rejectRetrieveDocument,
  resolveRetrieveDocument,
  sampleClaimObj
} from 'test/http-mocks/claim-store'
import { RoutablePath } from 'shared/router/routablePath'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'
const path: RoutablePath = ClaimPaths.sealedClaimPdfReceiver

describe('Sealed Claim: pdf', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', path.evaluateUri({ externalId: externalId }))

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(sampleClaimObj.defendantId, 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
        rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(path.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot generate PDF', async () => {
        resolveRetrieveClaimByExternalId()
        rejectRetrieveDocument('HTTP error')

        await request(app)
          .get(path.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return receipt when everything is fine', async () => {
        resolveRetrieveClaimByExternalId()
        resolveRetrieveDocument()

        await request(app)
          .get(path.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful)
      })
    })
  })
})
