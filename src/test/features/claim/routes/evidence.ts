import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { Paths } from 'claim/paths'
import { app } from 'main/app'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'

import { EvidenceType } from 'forms/models/evidenceType'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = Paths.evidencePage.uri
const pageContent: string = 'List any evidence'
import { FeatureToggles } from 'utils/featureToggles'

describe('Claim issue: evidence', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkEligibilityGuards(app, method, pagePath)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(pageContent))
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('valid form should redirect to task list', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate(100)

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ rows: [{ type: EvidenceType.CONTRACTS_AND_AGREEMENTS.value, description: 'Bla bla' }] })
          .expect(res => {
            if (FeatureToggles.isEnabled('pcq')) {
              expect(res.status).to.be.satisfy(function (code) {
                if ((code === 302) || (code === 200)) {
                  return true
                } else {
                  return false
                }
              })
            } else {
              expect(res => expect(res).to.be.redirect.toLocation(Paths.taskListPage.uri))
            }
          })
      })

      it('should render page when missing description', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send({
            rows: [{
              type: EvidenceType.CONTRACTS_AND_AGREEMENTS.value,
              description: undefined
            }]
          })
          .expect(res => {
            if (FeatureToggles.isEnabled('pcq')) {
              expect(res.status).to.be.satisfy(function (code) {
                if ((code === 302) || (code === 200)) {
                  return true
                } else {
                  return false
                }
              })
            } else {
              expect(res => expect(res).to.be.redirect.toLocation(Paths.taskListPage.uri))
            }
          })
      })

      describe('add row action', () => {
        it('should render page when valid input', async () => {
          draftStoreServiceMock.resolveFind('claim')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ action: { addRow: 'Add row' } })
            .expect(res => expect(res).to.be.successful.withText('List any evidence (optional)'))
        })
      })
    })
  })
})
