import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import '../../../../routes/expectations'
import { StatementOfMeansPaths } from 'response/paths'
import * as idamServiceMock from '../../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../../http-mocks/claim-store'
import { attachDefaultHooks } from '../../../../routes/hooks'
import { checkAuthorizationGuards } from '../checks/authorization-check'
import { checkAlreadySubmittedGuard } from '../checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuard } from '../checks/ccj-requested-check'
import { app } from '../../../../../main/app'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath: string = StatementOfMeansPaths.employersPage.evaluateUri(
  { externalId: claimStoreServiceMock.sampleClaimObj.externalId }
)

describe('Defendant response: Statement of means: employers', () => {

  attachDefaultHooks(app)

  describe('on GET', () => {

    checkAuthorizationGuards(app, 'get', pagePath)

    context('when user authorised', () => {

      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, 'get', pagePath)

      context('when response and CCJ not submitted', () => {

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Who employs you?'))
        })
      })
    })
  })

  describe('on POST', () => {

    checkAuthorizationGuards(app, 'post', pagePath)

    describe('for authorized user', () => {

      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, 'post', pagePath)

      describe('errors are handled properly', () => {

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      describe('save and continue', () => {

        it('should update draft store and redirect', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(pagePath)
            .send({ rows: [{ employerName: 'Comp1', jobTitle: 'BA' }, { employerName: 'Comp2', jobTitle: 'UX' }] })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(StatementOfMeansPaths.selfEmployedPage.evaluateUri(
                { externalId: claimStoreServiceMock.sampleClaimObj.externalId })
              )
            )
        })
      })

      describe('add a new row', () => {

        it('should update draft store and redirect', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .post(pagePath)
            .send({ action: { addRow: 'Add row' } })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Who employs you?'))
        })
      })
    })
  })
})
