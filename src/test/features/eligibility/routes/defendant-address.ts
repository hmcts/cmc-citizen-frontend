import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'eligibility/paths'

import { app } from '../../../../main/app'

import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { YesNoOption } from 'models/yesNoOption'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.defendantAddressPage.uri
const pageRedirect: string = Paths.over18Page.uri
const expectedTextOnPage: string = 'Does the person or organisation you’re claiming against have an address in England or Wales?'
const notEligibleReason: string = NotEligibleReason.DEFENDANT_ADDRESS

describe('Claim eligibility: defendant address page', () => {
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

    it('should redirect to over 18 page when form is valid and everything is fine', async () => {

      await request(app)
        .post(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ defendantAddress: YesNoOption.YES.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {

      await request(app)
        .post(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .send({ defendantAddress: YesNoOption.NO.option })
        .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.notEligiblePage.uri}?reason=${notEligibleReason}`))
    })
  })
})
