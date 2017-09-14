import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'ccj/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { sampleClaimObj } from '../../../http-mocks/claim-store'
import { partyDetails } from '../../../data/draft/partyDetails'
import { PartyType } from 'app/common/partyType'
const externalId = sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const paidAmountPage = Paths.paidAmountPage.uri.replace(':externalId', externalId)
const dateOfBirthPage = Paths.dateOfBirthPage.uri.replace(':externalId', externalId)

function checkAccessGuard (app: any, method: string) {
  PartyType.except(PartyType.INDIVIDUAL).forEach(partyType => {
    it(`should redirect to dashboard page when defendant type is ${partyType.name.toLocaleLowerCase()}`, async () => {
      claimStoreServiceMock.resolveRetrieveClaimByExternalId()
      draftStoreServiceMock.resolveRetrieve('ccj', {defendant: {partyDetails: partyDetails(partyType.value)}})

      await request(app)[method](dateOfBirthPage)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(DashboardPaths.dashboardPage.uri))
    })
  })
}

describe('CCJ - defendant date of birth', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', dateOfBirthPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      checkAccessGuard(app, 'get')

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(dateOfBirthPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectRetrieve('ccj', 'Error')

        await request(app)
          .get(dateOfBirthPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveRetrieve('ccj')

        await request(app)
          .get(dateOfBirthPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Defendant’s date of birth'))
      })
    })
  })

  describe('on POST', () => {
    const validFormData = { known: 'true', date: { day: '31', month: '12', year: '1900' } }

    checkAuthorizationGuards(app, 'post', dateOfBirthPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      checkAccessGuard(app, 'post')

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(dateOfBirthPage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectRetrieve('ccj', 'Error')

        await request(app)
          .post(dateOfBirthPage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should return 500 and render error page when cannot save ccj draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')
          draftStoreServiceMock.rejectSave('ccj', 'Error')

          await request(app)
            .post(dateOfBirthPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to paid amount page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')
          draftStoreServiceMock.resolveSave('ccj')

          await request(app)
            .post(dateOfBirthPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(paidAmountPage))
        })
      })

      context('when form is invalid', async () => {
        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')

          await request(app)
            .post(dateOfBirthPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ known: undefined })
            .expect(res => expect(res).to.be.successful.withText('Defendant’s date of birth', 'div class="error-summary"'))
        })
      })
    })
  })
})
