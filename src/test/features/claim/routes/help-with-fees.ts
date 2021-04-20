import { attachDefaultHooks } from 'test/routes/hooks'
import { app } from 'main/app'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkEligibilityGuards } from './checks/eligibility-check'
import { Paths as ClaimPaths } from 'claim/paths'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as request from 'supertest'
import { expect } from 'chai'
import * as config from 'config'
import { YesNoOption } from 'models/yesNoOption'

const pagePath: string = ClaimPaths.helpWithFeesPage.uri

const cookieName: string = config.get<string>('session.cookieName')
const pageContent: string = 'Do you have a Help With Fees reference number?'

describe('Claim issue: help with fees page', () => {
  attachDefaultHooks(app)

  context('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)
    checkEligibilityGuards(app, 'get', pagePath)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageContent))
    })
  })

  context('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)
    checkEligibilityGuards(app, 'post', pagePath)

    context('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageContent, 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid but cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ declared: YesNoOption.NO.option })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to claim total page when form is valid, yes is selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ declared: YesNoOption.YES.option, helpWithFeesNumber: 'HWF012345' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.totalPage.uri))
      })

      it('should redirect to claim total page when form is valid, no is selected and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ declared: YesNoOption.NO.option, helpWithFeesNumber: '' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.totalPage.uri))
      })
    })
  })
})
