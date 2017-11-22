import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'

import { Paths } from 'ccj/paths'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../app/forms/models/validationUtils'
import { LocalDate } from 'forms/models/localDate'

import * as moment from 'moment'
import { PayBySetDate, ValidationErrors } from 'forms/models/payBySetDate'
import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { checkAuthorizationGuards } from './checks/authorization-check'

const externalId = claimStoreServiceMock.sampleClaimObj.externalId

const cookieName: string = config.get<string>('session.cookieName')
const payBySetDatePage: string = Paths.payBySetDatePage.evaluateUri({ externalId : externalId })
const checkAndSavePage: string = Paths.checkAndSendPage.evaluateUri({ externalId : externalId })

describe('CCJ - Pay by set date', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', payBySetDatePage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .get(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveFind('ccj')

        await request(app)
          .get(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('When you want them to pay the amount'))
      })
    })
  })

  describe('on POST', () => {
    const validFormData = { known: 'true', date: { day: '31', month: '12', year: '2018' } }

    checkAuthorizationGuards(app, 'post', payBySetDatePage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectFind('Error')

        await request(app)
          .post(payBySetDatePage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should return 500 and render error page when cannot save ccj draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')
          draftStoreServiceMock.rejectSave()

          await request(app)
            .post(payBySetDatePage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to check and send page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')
          draftStoreServiceMock.resolveSave()

          await request(app)
            .post(payBySetDatePage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(checkAndSavePage))
        })
      })

      context('when form is invalid', async () => {
        it('should render page', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('ccj')

          await request(app)
            .post(payBySetDatePage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ known: undefined })
            .expect(res => expect(res).to.be.successful.withText('When you want them to pay the amount', 'div class="error-summary"'))
        })
      })
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    context('when pay by set date is known', () => {
      it('should reject non existing date', () => {
        const errors = validator.validateSync(new PayBySetDate(new LocalDate(2017, 2, 29)))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_NOT_VALID)
      })

      it('should reject past date', () => {
        const today = moment()

        const errors = validator.validateSync(new PayBySetDate(new LocalDate(today.year(), today.month() - 1, today.date())))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_TODAY_OR_IN_FUTURE)
      })

      it('should reject date with invalid digits in year', () => {
        const errors = validator.validateSync(new PayBySetDate(new LocalDate(90, 12, 31)))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_INVALID_YEAR)
      })
    })
  })
})
