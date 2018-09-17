/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { Defendant } from 'drafts/models/defendant'
import { CompanyDetails } from 'forms/models/companyDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { ResponseType } from 'response/form/models/responseType'
import { StatementOfMeansFeature } from 'response/helpers/statementOfMeansFeature'
import { Claim } from 'claims/models/claim'

const claim: Claim = new Claim()
claim.features = ['admissions']

describe('StatementOfMeansFeature', () => {

  describe('isApplicableFor', () => {
    function itShouldBeEnabledForNonBusinessAndDisabledForBusinessDefendants (responseDraft: ResponseDraft) {
      it('should be enabled for individual', () => {
        responseDraft.defendantDetails = new Defendant(new IndividualDetails())
        expect(StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.true
      })

      it('should be enabled for sole trader', () => {
        responseDraft.defendantDetails = new Defendant(new SoleTraderDetails())
        expect(StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.true
      })

      it('should be disabled for company', () => {
        responseDraft.defendantDetails = new Defendant(new CompanyDetails())
        expect(StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.false
      })

      it('should be disabled for organisation', () => {
        responseDraft.defendantDetails = new Defendant(new OrganisationDetails())
        expect(StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.false
      })
    }

    function itShouldBeDisabledForAllDefendantTypes (responseDraft: ResponseDraft) {
      it('should be disabled for all defendant types', () => {
        [IndividualDetails, SoleTraderDetails, CompanyDetails, OrganisationDetails].forEach((DefendantType) => {
          responseDraft.defendantDetails = new Defendant(new DefendantType())
          expect(StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.false
        })
      })
    }

    it('should throw an error if undefined is provided as input', () => {
      expect(() => StatementOfMeansFeature.isApplicableFor(claim, undefined)).to.throw(Error)
    })

    context('when response is full admission', () => {
      const responseDraft: ResponseDraft = {
        response: {
          type: ResponseType.FULL_ADMISSION
        },
        fullAdmission: {
          paymentIntention: {
            paymentOption: {
              option: PaymentType.INSTALMENTS
            }
          }
        }
      } as ResponseDraft

      itShouldBeEnabledForNonBusinessAndDisabledForBusinessDefendants(new ResponseDraft().deserialize(responseDraft))
    })

    context('when response is part admission - I have already paid', () => {
      const responseDraft: ResponseDraft = {
        response: {
          type: ResponseType.PART_ADMISSION
        },
        partialAdmission: new PartialAdmission().deserialize({
          alreadyPaid: { option: 'yes' },
          howMuchHaveYouPaid: { amount: 1, date: { day: 1, month: 1, year: 1999 }, text: 'aaa' },
          whyDoYouDisagree: { text: 'bbb' }
        })
      } as ResponseDraft

      itShouldBeDisabledForAllDefendantTypes(new ResponseDraft().deserialize(responseDraft))
    })

    context('when response is part admission - I have not already paid', () => {
      const responseDraft: ResponseDraft = {
        response: {
          type: ResponseType.PART_ADMISSION
        },
        partialAdmission: new PartialAdmission().deserialize({
          alreadyPaid: { option: 'no' },
          howMuchHaveYouPaid: { amount: 100 },
          whyDoYouDisagree: { text: 'bbb' },
          paymentIntention: {
            paymentOption: {
              option: PaymentType.INSTALMENTS
            }
          }
        })
      } as ResponseDraft

      itShouldBeEnabledForNonBusinessAndDisabledForBusinessDefendants(new ResponseDraft().deserialize(responseDraft))
    })

    context('when response is rejection', () => {
      const responseDraft: ResponseDraft = {
        response: {
          type: ResponseType.DEFENCE
        }
      } as ResponseDraft

      itShouldBeDisabledForAllDefendantTypes(new ResponseDraft().deserialize(responseDraft))
    })
  })
})
