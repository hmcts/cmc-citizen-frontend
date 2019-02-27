import { expect } from 'chai'
import * as request from 'supertest'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationMiddleware } from 'test/features/eligibility/routes/checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from 'main/app'

import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'

const pagePath: string = Paths.defendantAgePage.uri
const pageRedirect: string = Paths.over18Page.uri
const expectedTextOnPage: string = 'Do you believe the person you’re claiming against is 18 or over?'
const notEligibleReason: string = NotEligibleReason.UNDER_18_DEFENDANT

describe('Claim eligibility: over 18 defendant page', () => {
  attachDefaultHooks(app)

  context('on GET', () => {
    checkAuthorizationMiddleware(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {

      await request(app)
        .get(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })

  context('on POST', () => {
    checkAuthorizationMiddleware(app, 'post', pagePath)

    it('should render page when form is invalid and everything is fine', async () => {

      await request(app)
        .post(pagePath)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'))
    })

    it('should redirect to claim type page when everything is valid, the defendant is said to be over 18 and everything is fine', async () => {

      await request(app)
        .post(pagePath)
        .send({ defendantAge: DefendantAgeOption.YES.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it('should redirect to claim type page when form is valid, the defendant is said to a company or organisation and everything is fine', async () => {

      await request(app)
        .post(pagePath)
        .send({ defendantAge: DefendantAgeOption.COMPANY_OR_ORGANISATION.option })
        .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
    })

    it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {

      await request(app)
        .post(pagePath)
        .send({ defendantAge: DefendantAgeOption.NO.option })
        .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.notEligiblePage.uri}?reason=${notEligibleReason}`))
    })
  })
})
