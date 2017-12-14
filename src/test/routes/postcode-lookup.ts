import * as request from 'supertest'
import * as config from 'config'

import './expectations'
import './mocks/mockPostcodeInfoClient'
import { Paths as AppPaths } from 'app/paths'
import { app } from '../../main/app'

const cookieName: string = config.get<string>('session.cookieName')

describe('Postcode lookup', () => {
  describe('on GET', () => {
    it('should return result from postcode client', () =>
      request(app)
        .get(`${AppPaths.postcodeLookupProxy.uri}?postcode=111`)
        .set('Cookie', `${cookieName}=ABC`)
          .expect(200, { valid: false })
    )
    it('should return error from postcode client', () =>
      request(app)
        .get(`${AppPaths.postcodeLookupProxy.uri}?postcode=fail`)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(500, { error: { status: 500, message: 'Mocked failure' } })
    )
  })
})
