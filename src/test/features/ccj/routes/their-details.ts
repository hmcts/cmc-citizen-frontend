import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'ccj/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { sampleClaimObj } from '../../../http-mocks/claim-store'
import { partyDetails } from '../../../data/draft/partyDetails'
import { PartyType } from 'app/common/partyType'

const cookieName: string = config.get<string>('session.cookieName')

const externalId = sampleClaimObj.externalId
const theirDetailsPage = Paths.theirDetailsPage.evaluateUri({ externalId: externalId })
const dateOfBirthPage = Paths.dateOfBirthPage.evaluateUri({ externalId: externalId })
const paidAmountPage = Paths.paidAmountPage.evaluateUri({ externalId: externalId })

const validFormData = {
  line1: 'Apt 99',
  line2: '',
  city: 'London',
  postcode: 'E1'
}

describe('CCJ - their details', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', theirDetailsPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(theirDetailsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveRetrieve('ccj')

        await request(app)
          .get(theirDetailsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Confirm their details'))
      })
    })
    describe('on POST', () => {
      checkAuthorizationGuards(app, 'post', theirDetailsPage)
      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
        })

        context('when form is valid', async () => {
          it('should redirect to defendant date of birth page when defendant is an individual', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')
            draftStoreServiceMock.resolveSave('ccj')

            await request(app)
              .post(theirDetailsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send(validFormData)
              .expect(res => expect(res).to.be.redirect.toLocation(dateOfBirthPage))
          })

          PartyType.except(PartyType.INDIVIDUAL).forEach(partyType => {
            it(`should redirect to defendant amount paid page when defendant is ${partyType.name.toLocaleLowerCase()}`, async () => {
              claimStoreServiceMock.resolveRetrieveClaimByExternalId()
              draftStoreServiceMock.resolveRetrieve('ccj', {defendant: {partyDetails: partyDetails(partyType.value)}})
              draftStoreServiceMock.resolveSave('ccj')

              await request(app)
                .post(theirDetailsPage)
                .set('Cookie', `${cookieName}=ABC`)
                .send(validFormData)
                .expect(res => expect(res).to.be.redirect.toLocation(paidAmountPage))
            })
          })
        })

        context('when form is invalid', async () => {
          it('should render page', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveRetrieve('ccj')

            await request(app)
              .post(theirDetailsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ name: 'John Smith' })
              .expect(res => expect(res).to.be.successful.withText('Confirm their details', 'div class="error-summary"'))
          })
        })
      })
    })
  })
})
