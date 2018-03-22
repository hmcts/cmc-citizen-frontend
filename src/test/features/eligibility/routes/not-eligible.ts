import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { app } from '../../../../main/app'

import { Paths } from 'eligibility/paths'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.notEligiblePage.uri
const expectedTextOnPage: string = 'You can’t use this service'

describe('Claim eligibility: not eligible page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })
})
