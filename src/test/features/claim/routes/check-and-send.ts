import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as feesServiceMock from 'test/http-mocks/fees'
import { SignatureType } from 'common/signatureType'
import {
  companyDetails,
  individualDetails,
  organisationDetails,
  soleTraderDetails
} from 'test/data/draft/partyDetails'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: check and send page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.checkAndSendPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.checkAndSendPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should redirect to incomplete submission when not all tasks are completed', async () => {
        draftStoreServiceMock.resolveFind('claim', { readResolveDispute: false })

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.incompleteSubmissionPage.uri))
      })

      it('should return 500 and render error page when cannot calculate fee', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.rejectCalculateIssueFee('HTTP error')

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Check your answers'))
      })

      it('Should validate check-and-send Page hyperlink with correct location and span', async () => {
        draftStoreServiceMock.resolveFind('claim',{ claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: individualDetails } , defendant: { ...draftStoreServiceMock.sampleClaimDraftObj.defendant, partyDetails: individualDetails } })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Check your answers'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/claimant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/claimant-individual-details" class="bold">Change <span class="visuallyhidden">address</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/claimant-dob" class="bold">Change <span class="visuallyhidden">date of birth</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/claimant-mobile" class="bold">Change <span class="visuallyhidden">contact number (optional)</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/defendant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/defendant-individual-details" class="bold">Change <span class="visuallyhidden">address</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/defendant-email" class="bold">Change <span class="visuallyhidden">email</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/amount" class="bold">Change <span class="visuallyhidden">claim amount breakdown</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/interest" class="bold">Change <span class="visuallyhidden">claim interest</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/interest-rate" class="bold">Change <span class="visuallyhidden">how do you want to claim interest?</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/interest-date" class="bold">Change <span class="visuallyhidden">when are you claiming interest from?</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/reason" class="bold">Change <span class="visuallyhidden">why you believe you’re owed the money:</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/timeline" class="bold">Change <span class="visuallyhidden">timeline of what happened</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('<a href="/claim/evidence" class="bold">Change <span class="visuallyhidden">your evidence (optional)</span></a>'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth'))
          .expect(res => expect(res).to.be.successful.withText('I believe that the facts stated in this claim are true.'))
          .expect(res => expect(res).to.be.successful.withText('input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText('input type="submit" class="button"'))
      })

      context('Validate details for claimant on check-and-send page', () => {
        [
          [individualDetails],
          [soleTraderDetails],
          [companyDetails],
          [organisationDetails]
        ].forEach(([partyDetails]) => {
          it(`Should validate that a claim made by individual against ${partyDetails.type}`, async () => {
            draftStoreServiceMock.resolveFind('claim',
              { defendant: { ...draftStoreServiceMock.sampleClaimDraftObj.defendant, partyDetails: partyDetails } })
            feesServiceMock.resolveCalculateIssueFee()

            await request(app)
              .get(ClaimPaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('<a href="/claim/claimant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
              .expect(res => expect(res).to.be.successful.withText('Full name'))
              .expect(res => expect(res).to.be.successful.withText('John Smith'))
              .expect(res => expect(res).to.be.successful.withText('Statement of truth'))
              .expect(res => expect(res).to.be.successful.withText('I believe that the facts stated in this claim are true.'))
              .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          })

          it(`Should validate that a claim made by soleTrader against ${partyDetails.type}`, async () => {
            draftStoreServiceMock.resolveFind('claim',
              { claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: soleTraderDetails } })
            feesServiceMock.resolveCalculateIssueFee()

            await request(app)
              .get(ClaimPaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('<a href="/claim/claimant-sole-trader-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
              .expect(res => expect(res).to.be.successful.withText('Business name'))
              .expect(res => expect(res).to.be.successful.withText('Trading as SoleTrader Ltd.'))
              .expect(res => expect(res).to.be.successful.withText('Statement of truth'))
              .expect(res => expect(res).to.be.successful.withText('I believe that the facts stated in this claim are true.'))
              .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          })

          it(`Should validate that a claim made by company against ${partyDetails.type}`, async () => {
            draftStoreServiceMock.resolveFind('claim',
              {
                claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: companyDetails }
              })
            feesServiceMock.resolveCalculateIssueFee()

            await request(app)
              .get(ClaimPaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('<a href="/claim/claimant-company-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
              .expect(res => expect(res).to.be.successful.withText('Company Ltd.'))
              .expect(res => expect(res).to.be.successful.withText('Statement of truth'))
              .expect(res => expect(res).to.be.successful.withText('Types of senior position'))
              .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"'))
              .expect(res => expect(res).to.be.successful.withText('<input id="signerRole" name="signerRole"'))
              .expect(res => expect(res).to.be.successful.withText('I believe that the facts stated in this claim are true.'))
              .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          })

          it(`Should validate that a claim made by organisation against ${partyDetails.type}`, async () => {
            draftStoreServiceMock.resolveFind('claim',
              {
                claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: organisationDetails }
              })
            feesServiceMock.resolveCalculateIssueFee()

            await request(app)
              .get(ClaimPaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('<a href="/claim/claimant-organisation-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
              .expect(res => expect(res).to.be.successful.withText('Organisation.'))
              .expect(res => expect(res).to.be.successful.withText('Statement of truth'))
              .expect(res => expect(res).to.be.successful.withText('Types of senior position'))
              .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"'))
              .expect(res => expect(res).to.be.successful.withText('<input id="signerRole" name="signerRole"'))
              .expect(res => expect(res).to.be.successful.withText('I believe that the facts stated in this claim are true.'))
              .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          })
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.checkAndSendPage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.checkAndSendPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should redirect to incomplete submission when not all tasks are completed', async () => {
        draftStoreServiceMock.resolveFind('claim', { readResolveDispute: false })

        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.incompleteSubmissionPage.uri))
      })

      it('should return 500 and render error page when form is invalid and cannot calculate fee', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.rejectCalculateIssueFee('HTTP error')

        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Check your answers', 'div class="error-summary"'))
      })

      it('should redirect to payment page when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .send({ signed: 'true' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.startPaymentReceiver.uri))
      })
    })
  })
})
