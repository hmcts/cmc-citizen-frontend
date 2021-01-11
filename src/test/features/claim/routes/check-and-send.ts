import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

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
import { YesNoOption } from 'models/yesNoOption'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import {
  claimantSoleTraderDetails,
  companyDetails,
  defendantIndividualDetails,
  defendantSoleTraderDetails,
  individualDetails,
  organisationDetails
} from 'test/data/draft/partyDetails'

const cookieName: string = config.get<string>('session.cookieName')
const expectedLink = ({ href = '', text = '', hiddenText = '' }) => {
  return `<a class="govuk-link" href="${href}">${text} <span class="govuk-visually-hidden">${hiddenText}</span></a>`
}
const hiddenTextFullName = 'full name'

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
        draftStoreServiceMock.resolveFind('claim', {
          claimant: {
            ...draftStoreServiceMock.sampleClaimDraftObj.claimant,
            partyDetails: individualDetails
          },
          defendant: {
            ...draftStoreServiceMock.sampleClaimDraftObj.defendant,
            partyDetails: defendantIndividualDetails
          }
        })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Check your answers'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-individual-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-dob', text: 'Change', hiddenText: 'date of birth' })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-phone', text: 'Change', hiddenText: 'contact number (optional)' })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-individual-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-email', text: 'Change', hiddenText: 'email' })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/amount', text: 'Change', hiddenText: 'claim amount breakdown' })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/interest', text: 'Change', hiddenText: 'claim interest' })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/interest-rate', text: 'Change', hiddenText: 'how do you want to claim interest?' })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/interest-date', text: 'Change', hiddenText: 'when are you claiming interest from?' })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/reason', text: 'Change', hiddenText: 'why you believe you’re owed the money:' })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/timeline', text: 'Change', hiddenText: 'timeline of what happened' })))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/evidence', text: 'Change', hiddenText: 'your evidence (optional)' })))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText('input type="submit" class="button"'))
      })

      it('Should validate that a claim made by individual against soleTrader and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            defendant: {
              ...draftStoreServiceMock.sampleClaimDraftObj.defendant,
              partyDetails: defendantSoleTraderDetails
            }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-individual-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Full name', 'John Smith'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-sole-trader-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Business name', 'Trading as Defendant SoleTrader Ltd.'))
      })

      it('Should validate that a claim made by individual against company and their details.', async () => {
        draftStoreServiceMock.resolveFind('claim',
          { defendant: { ...draftStoreServiceMock.sampleClaimDraftObj.defendant, partyDetails: companyDetails } })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-individual-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Full name', 'John Smith'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-company-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Company Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('Full name'))
          .expect(res => expect(res).to.be.successful.withoutText('Business name'))
      })

      it('Should validate that a claim made by individual against organisation and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          { defendant: { ...draftStoreServiceMock.sampleClaimDraftObj.defendant, partyDetails: organisationDetails } })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-individual-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Full name', 'John Smith'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-organisation-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Organisation.'))
          .expect(res => expect(res).to.be.successful.withoutText('Business name'))
      })

      it('Should validate that a claim made by soleTrader against soleTrader and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: {
              ...draftStoreServiceMock.sampleClaimDraftObj.claimant,
              partyDetails: claimantSoleTraderDetails
            },
            defendant: {
              ...draftStoreServiceMock.sampleClaimDraftObj.defendant,
              partyDetails: defendantSoleTraderDetails
            }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-sole-trader-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Business name', 'Trading as Claimant SoleTrader Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-sole-trader-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Trading as Defendant SoleTrader Ltd.'))
      })

      it('Should validate that a claim made by soleTrader against individual and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: {
              ...draftStoreServiceMock.sampleClaimDraftObj.claimant,
              partyDetails: claimantSoleTraderDetails
            }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-sole-trader-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Business name', 'Trading as Claimant SoleTrader Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-individual-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Full name'))
          .expect(res => expect(res).to.be.successful.withText('Rose Smith'))
      })

      it('Should validate that a claim made by soleTrader against company and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: {
              ...draftStoreServiceMock.sampleClaimDraftObj.claimant,
              partyDetails: claimantSoleTraderDetails
            }, defendant: {
              ...draftStoreServiceMock.sampleClaimDraftObj.defendant,
              partyDetails: companyDetails
            }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-sole-trader-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Business name', 'Trading as Claimant SoleTrader Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-company-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Company Ltd.'))
      })

      it('Should validate that a claim made by soleTrader against organisation and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: {
              ...draftStoreServiceMock.sampleClaimDraftObj.claimant,
              partyDetails: claimantSoleTraderDetails
            }, defendant: { ...draftStoreServiceMock.sampleClaimDraftObj.defendant, partyDetails: organisationDetails }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-sole-trader-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Business name', 'Trading as Claimant SoleTrader Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-organisation-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Organisation.'))
          .expect(res => expect(res).to.be.successful.withText('I believe that the facts stated in this claim are true'))

      })

      it('Should validate that a claim made by company against company and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: companyDetails },
            defendant: { ...draftStoreServiceMock.sampleClaimDraftObj.defendant, partyDetails: companyDetails }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-company-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Company Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-company-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Company Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('Types of senior position'))
          .expect(res => expect(res).to.be.successful.withoutText('Business name'))
      })

      it('Should validate that a claim made by company against individual and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          { claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: companyDetails } })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-company-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Company Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-individual-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Full name'))
          .expect(res => expect(res).to.be.successful.withText('Rose Smith'))
          .expect(res => expect(res).to.be.successful.withoutText('Business name'))
      })

      it('Should validate that a claim made by company against soleTrader and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: companyDetails },
            defendant: {
              ...draftStoreServiceMock.sampleClaimDraftObj.defendant,
              partyDetails: defendantSoleTraderDetails
            }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-company-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Company Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-sole-trader-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Business name'))
          .expect(res => expect(res).to.be.successful.withText('Trading as Defendant SoleTrader Ltd.'))
      })

      it('Should validate that a claim made by company against organisation and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: companyDetails },
            defendant: { ...draftStoreServiceMock.sampleClaimDraftObj.defendant, partyDetails: organisationDetails }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-company-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Company Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-organisation-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Organisation.'))
          .expect(res => expect(res).to.be.successful.withoutText('Business name'))
      })

      it('Should validate that a claim made by organisation against organisation and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: organisationDetails },
            defendant: { ...draftStoreServiceMock.sampleClaimDraftObj.defendant, partyDetails: organisationDetails }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-organisation-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Organisation.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-organisation-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Organisation.'))
          .expect(res => expect(res).to.be.successful.withoutText('Business name'))
      })

      it('Should validate that a claim made by organisation against individual and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          { claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: organisationDetails } })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-organisation-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Organisation.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-individual-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Full name'))
          .expect(res => expect(res).to.be.successful.withText('Rose Smith'))
          .expect(res => expect(res).to.be.successful.withoutText('Business name'))
      })

      it('Should validate that a claim made by organisation against soleTrader and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: organisationDetails },
            defendant: {
              ...draftStoreServiceMock.sampleClaimDraftObj.defendant,
              partyDetails: defendantSoleTraderDetails
            }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-organisation-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Organisation.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-sole-trader-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Business name'))
          .expect(res => expect(res).to.be.successful.withText('Trading as Defendant SoleTrader Ltd.'))
      })

      it('Should validate that a claim made by organisation against company and their details', async () => {
        draftStoreServiceMock.resolveFind('claim',
          {
            claimant: { ...draftStoreServiceMock.sampleClaimDraftObj.claimant, partyDetails: organisationDetails },
            defendant: { ...draftStoreServiceMock.sampleClaimDraftObj.defendant, partyDetails: companyDetails }
          })
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.checkAndSendPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/claimant-organisation-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Organisation.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
          .expect(res => expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
          .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          .expect(res => expect(res).to.be.successful.withText(expectedLink({ href: '/claim/defendant-company-details', text: 'Change', hiddenText: hiddenTextFullName })))
          .expect(res => expect(res).to.be.successful.withText('Company Ltd.'))
          .expect(res => expect(res).to.be.successful.withText('Types of senior position'))
          .expect(res => expect(res).to.be.successful.withoutText('Business name'))
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
        let nextPage: string = ClaimPaths.startPaymentReceiver.uri
        if (toBoolean(config.get('featureToggles.inversionOfControl'))) {
          nextPage = ClaimPaths.initiatePaymentController.uri
        }
        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .send({ signed: 'true' })
          .expect(res => expect(res).to.be.redirect.toLocation(nextPage))
      })

      it('should redirect to confirmation page when form is valid and help with fee is submitted', async () => {
        draftStoreServiceMock.resolveFind('claim', {
          helpWithFees: {
            declared: YesNoOption.YES,
            helpWithFeesNumber: 'HWF123456',
            feeAmountInPennies: 200
          }
        })
        claimStoreServiceMock.resolveSaveHelpWithFeesClaimForUser()
        claimStoreServiceMock.resolveRetrieveUserRoles()
        draftStoreServiceMock.resolveDelete()

        const nextPage = ClaimPaths.confirmationPage.uri.replace(':externalId', 'fe6e9413-e804-48d5-bbfd-645917fc46e5')
        if (process.env.FEATURE_HELP_WITH_FEES) {
          await request(app)
            .post(ClaimPaths.checkAndSendPage.uri)
            .send({ type: SignatureType.BASIC })
            .set('Cookie', `${cookieName}=ABC`)
            .send({ signed: 'true' })
            .expect(res => expect(res).to.be.redirect.toLocation(nextPage))
        } else {
          let nextPaymentPage: string = ClaimPaths.startPaymentReceiver.uri
          if (toBoolean(config.get('featureToggles.inversionOfControl'))) {
            nextPaymentPage = ClaimPaths.initiatePaymentController.uri
          }
          await request(app)
            .post(ClaimPaths.checkAndSendPage.uri)
            .send({ type: SignatureType.BASIC })
            .set('Cookie', `${cookieName}=ABC`)
            .send({ signed: 'true' })
            .expect(res => expect(res).to.be.redirect.toLocation(nextPaymentPage))
        }
      })

      it('should redirect to tasklist page when form is valid and help with fee submission throws error', async () => {
        draftStoreServiceMock.resolveFind('claim', {
          helpWithFees: {
            declared: YesNoOption.YES,
            helpWithFeesNumber: 'HWF123456'
          }
        })
        // mock 'saveHelpWithFees' request with error
        claimStoreServiceMock.resolveSaveHelpWithFeesClaimWithError()
        claimStoreServiceMock.resolveRetrieveUserRoles()

        const nextPage = ClaimPaths.taskListPage.uri
        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .send({ signed: 'true' })
          .expect(res => expect(res).to.be.redirect.toLocation(nextPage))
      })

      it('should redirect to confirmation page when form is valid, user initiated payment, but help with fee is submitted', async () => {
        draftStoreServiceMock.resolveFind('claim', {
          helpWithFees: {
            declared: YesNoOption.YES,
            helpWithFeesNumber: 'HWF123456'
          }
        })
        // mock 'awaiting payment' state
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({ state: 'AWAITING_CITIZEN_PAYMENT' })
        // mock updateHelpWithFees 'put' request
        claimStoreServiceMock.resolveUpdateHelpWithFeesClaimForUser()
        // mock user roles
        claimStoreServiceMock.resolveRetrieveUserRoles()
        // mock delete draft
        draftStoreServiceMock.resolveDelete()

        const nextPage = ClaimPaths.confirmationPage.uri.replace(':externalId', 'fe6e9413-e804-48d5-bbfd-645917fc46e5')
        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .send({ signed: 'true' })
          .expect(res => expect(res).to.be.redirect.toLocation(nextPage))
      })

      it('should redirect to tasklist page when form is valid, user initiated payment, but used help with fee submission which failed with errors', async () => {
        draftStoreServiceMock.resolveFind('claim', {
          helpWithFees: {
            declared: YesNoOption.YES,
            helpWithFeesNumber: 'HWF123456'
          }
        })
        // mock 'awaiting payment' state
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({ state: 'AWAITING_CITIZEN_PAYMENT' })
        // mock updateHelpWithFees 'put' request failed with error
        claimStoreServiceMock.resolveUpdateHelpWithFeesClaimWithError()
        // mock user roles
        claimStoreServiceMock.resolveRetrieveUserRoles()

        const nextPage = ClaimPaths.taskListPage.uri
        await request(app)
          .post(ClaimPaths.checkAndSendPage.uri)
          .send({ type: SignatureType.BASIC })
          .set('Cookie', `${cookieName}=ABC`)
          .send({ signed: 'true' })
          .expect(res => expect(res).to.be.redirect.toLocation(nextPage))
      })
    })
  })
})
