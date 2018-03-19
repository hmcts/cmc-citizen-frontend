import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'eligibility/paths'

import { app } from '../../../../main/app'

import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { ClaimValue } from 'eligibility/model/claimValue'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.claimValuePage.uri
const pageRedirect: string = Paths.helpWithFeesPage.uri
const expectedTextOnPage: string = 'Total amount you’re claiming'
const notEligibleReason: string = NotEligibleReason.CLAIM_VALUE_NOT_KNOWN

describe('Claim eligibility: claim value page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    it('should render page when everything is fine', async () => {

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })

  describe('on POST', () => {
    it('should render page when form is invalid and everything is fine', async () => {

      await request(app)
        .post(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'))
    })

    it('should redirect to help with fees page when form is valid and everything is fine', async () => {

      await request(app)
        .post(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ claimValue: ClaimValue.UNDER_10000.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {

      await request(app)
        .post(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ claimValue: ClaimValue.NOT_KNOWN.option })
        .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.notEligiblePage.uri}?reason=${notEligibleReason}`))
    })
  })
})
