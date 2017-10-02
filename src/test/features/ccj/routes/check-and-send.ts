import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as CCJPaths } from 'ccj/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { sampleClaimObj } from '../../../http-mocks/claim-store'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import { SignatureType } from 'app/common/signatureType'
import { ValidationErrors as BasicValidationErrors } from 'ccj/form/models/declaration'
import { ValidationErrors as QualifiedValidationErrors } from 'ccj/form/models/qualifiedDeclaration'

const externalId = sampleClaimObj.externalId
const cookieName: string = config.get<string>('session.cookieName')
const cnsPage = CCJPaths.checkAndSendPage.evaluateUri({ externalId: externalId })
const confirmationPage = CCJPaths.confirmationPage.evaluateUri({ externalId: externalId })

describe('CCJ: check and send page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', cnsPage)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      })

      context('when user authorised', () => {
        it('should return 500 and render error page when cannot retrieve claims', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(cnsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.rejectRetrieve('ccj', 'Error')

          await request(app)
            .get(cnsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')

          await request(app)
            .get(cnsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
        })
      })
    })
  })

  describe('on POST', () => {
    const validBasicFormData = { signed: 'true', type: SignatureType.BASIC }
    const validQualifiedFormData = {
      signed: 'true',
      type: SignatureType.QUALIFIED,
      signerName: 'Jonny',
      signerRole: 'Director'
    }

    checkAuthorizationGuards(app, 'post', cnsPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta')
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .post(cnsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validBasicFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 when cannot retrieve CCJ draft', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.rejectRetrieve('ccj', 'Error')

        await request(app)
          .post(cnsPage)
          .set('Cookie', `${cookieName}=ABC`)
          .send(validBasicFormData)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      context('when form is valid', async () => {
        it('should redirect to confirmation page when signature is basic', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')
          draftStoreServiceMock.resolveSave('ccj')
          claimStoreServiceMock.resolveSaveCcjForUser()
          draftStoreServiceMock.resolveDelete('ccj')

          await request(app)
            .post(cnsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validBasicFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(confirmationPage))
        })
        it('should redirect to confirmation page when signature is qualified', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')
          draftStoreServiceMock.resolveSave('ccj')
          claimStoreServiceMock.resolveSaveCcjForUser()
          draftStoreServiceMock.resolveDelete('ccj')

          await request(app)
            .post(cnsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validQualifiedFormData)
            .expect(res => expect(res).to.be.redirect.toLocation(confirmationPage))
        })

        it('should return 500 when cannot save CCJ', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')
          draftStoreServiceMock.resolveSave('ccj')
          claimStoreServiceMock.rejectSaveCcjForUser()

          await request(app)
            .post(cnsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validBasicFormData)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      context('when form is invalid', async () => {
        it('should render page with error messages when signature is basic', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')

          await request(app)
            .post(cnsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ signed: undefined, type: SignatureType.BASIC })
            .expect(res => expect(res).to.be.successful.withText(BasicValidationErrors.DECLARATION_REQUIRED,
              'div class="error-summary"'))
        })
        it('should render page with error messages when signature is qualified', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveRetrieve('ccj')

          await request(app)
            .post(cnsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .send({ signed: 'true', type: SignatureType.QUALIFIED, signerName: '', signerRole: '' })
            .expect(res => expect(res).to.be.successful.withText(QualifiedValidationErrors.SIGNER_NAME_REQUIRED,
              'div class="error-summary"'))
        })

      })
    })
  })
})
