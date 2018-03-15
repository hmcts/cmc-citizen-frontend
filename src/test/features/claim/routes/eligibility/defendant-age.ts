import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../../routes/hooks'
import '../../../../routes/expectations'
import { checkAuthorizationGuards } from '../checks/authorization-check'

import { Paths } from 'eligibility/paths'

import { app } from '../../../../../main/app'

import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { DefendantAgeOption } from 'claim/form/models/eligibility/defendantAgeOption'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.defendantAgePage.uri
const pageRedirect: string = Paths.claimTypePage.uri
const expectedTextOnPage: string = 'Do you believe the person you’re claiming against is 18 or over?'
const notEligibleReason: string = NotEligibleReason.UNDER_18_DEFENDANT

describe('Claim eligibility: over 18 defendant page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)

    describe('for authorized user', () => {

      /**
       * Our generic class for Eligibility does not support invalid form in terms of eligibility. (YET)
       */
      xit('should render page when form is invalid and everything is fine', async () => {

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'))
      })

      it('should redirect to claim type page when form is valid and everything is fine', async () => {

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ defendantAge: DefendantAgeOption.YES.option })
          .expect(res => expect(res).to.be.redirect.toLocation(pageRedirect))
      })

      it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ defendantAge: DefendantAgeOption.NO.option })
          .expect(res => expect(res).to.be.redirect.toLocation(`${Paths.notEligiblePage.uri}?reason=${notEligibleReason}`))
      })
    })
  })
})
