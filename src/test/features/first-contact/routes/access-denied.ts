import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { ErrorPaths as DefendantFirstContactErrorPaths } from 'first-contact/paths'

import { app } from '../../../../main/app'

describe('Defendant first contact: access denied page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {
      await request(app)
        .get(DefendantFirstContactErrorPaths.claimSummaryAccessDeniedPage.uri)
        .expect(res => expect(res).to.be.successful.withText('You are not authorised to view the claim!'))
    })
  })
})
