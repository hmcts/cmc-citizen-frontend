import { expect } from 'chai'
import * as request from 'supertest'
import * as mock from 'nock'

import './expectations'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../main/app'

describe('Legacy claimant login receiver', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    it('should redirect to new claimant login receiver', async () => {
      await request(app)
        .get(AppPaths.legacyClaimantLoginReceiver.uri)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantLoginReceiver.uri))
    })

    it('should preserve query string', async () => {
      const queryString = '?claim=000MC001&jwt=ABC'

      await request(app)
        .get(AppPaths.legacyClaimantLoginReceiver.uri + queryString)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.claimantLoginReceiver.uri + queryString))
    })
  })
})
