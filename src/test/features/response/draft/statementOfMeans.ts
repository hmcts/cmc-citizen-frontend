/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { Employers } from 'response/form/models/statement-of-means/employers'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseType } from 'response/form/models/responseType'

import { Defendant } from 'drafts/models/defendant'
import { IndividualDetails } from 'forms/models/individualDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { RejectPartOfClaim, RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'

describe('StatementOfMeans', () => {
  describe('deserialize', () => {
    it('should return empty StatementOfMeans for undefined given as input', () => {
      const actual = new StatementOfMeans().deserialize(undefined)

      expect(actual).to.be.instanceof(StatementOfMeans)
      expect(actual.residence).to.be.eq(undefined)
      expect(actual.employment).to.be.eq(undefined)
      expect(actual.employers).to.be.eq(undefined)
      expect(actual.selfEmployed).to.be.eq(undefined)
    })

    it('should return populated StatementOfMeans for valid input', () => {
      const actual = new StatementOfMeans().deserialize({
        residence: {
          type: {
            value: ResidenceType.OTHER.value,
            displayValue: ResidenceType.OTHER.displayValue
          },
          housingDetails: 'Squat'
        },
        employment: {
          isCurrentlyEmployed: true,
          employed: true,
          selfEmployted: true
        },
        employers: {
          rows: [
            {
              employerName: 'Company',
              jobTitle: 'role'
            }
          ]
        },
        selfEmployed: {
          jobTitle: 'role',
          annualTurnover: 1111,
          areYouBehindOnTax: true,
          amountYouOwe: 222,
          reason: 'I did not pay'
        }
      })

      expect(actual).to.be.instanceof(StatementOfMeans)
      expect(actual.residence).to.be.instanceOf(Residence)
      expect(actual.residence.type.value).to.equal(ResidenceType.OTHER.value)
      expect(actual.employment).to.be.instanceof(Employment)
      expect(actual.employers).to.be.instanceof(Employers)
      expect(actual.selfEmployed).to.be.instanceof(SelfEmployed)
    })
  })

  describe('isApplicableFor', () => {
    function itShouldBeEnabledForNonBusinessAndDisabledForBusinessDefendants (responseDraft: ResponseDraft) {
      it('should be enabled for individual', () => {
        responseDraft.defendantDetails = new Defendant(new IndividualDetails())
        expect(StatementOfMeans.isApplicableFor(responseDraft)).to.be.true
      })

      it('should be enabled for sole trader', () => {
        responseDraft.defendantDetails = new Defendant(new SoleTraderDetails())
        expect(StatementOfMeans.isApplicableFor(responseDraft)).to.be.true
      })

      it('should be disabled for company', () => {
        responseDraft.defendantDetails = new Defendant(new CompanyDetails())
        expect(StatementOfMeans.isApplicableFor(responseDraft)).to.be.false
      })

      it('should be disabled for organisation', () => {
        responseDraft.defendantDetails = new Defendant(new OrganisationDetails())
        expect(StatementOfMeans.isApplicableFor(responseDraft)).to.be.false
      })
    }

    function itShouldBeDisabledForAllDefendantTypes (responseDraft: ResponseDraft) {
      it('should be disabled for all defendant types', () => {
        [IndividualDetails, SoleTraderDetails, CompanyDetails, OrganisationDetails].forEach((DefendantType) => {
          responseDraft.defendantDetails = new Defendant(new DefendantType())
          expect(StatementOfMeans.isApplicableFor(responseDraft)).to.be.false
        })
      })
    }

    it('should throw an error if undefined is provided as input', () => {
      expect(() => StatementOfMeans.isApplicableFor(undefined)).to.throw(Error)
    })

    context('when response is full admission', () => {
      const responseDraft: ResponseDraft = {
        response: {
          type: ResponseType.FULL_ADMISSION
        },
        fullAdmission: {
          paymentOption: {
            option: DefendantPaymentType.INSTALMENTS
          }
        }
      } as ResponseDraft

      itShouldBeEnabledForNonBusinessAndDisabledForBusinessDefendants(new ResponseDraft().deserialize(responseDraft))
    })

    context('when response is part admission - I paid what I believe I owe', () => {
      const responseDraft: ResponseDraft = {
        response: {
          type: ResponseType.PART_ADMISSION
        },
        rejectPartOfClaim: new RejectPartOfClaim(RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED)
      } as ResponseDraft

      itShouldBeDisabledForAllDefendantTypes(responseDraft)
    })

    context('when response is rejection', () => {
      const responseDraft: ResponseDraft = {
        response: {
          type: ResponseType.DEFENCE
        }
      } as ResponseDraft

      itShouldBeDisabledForAllDefendantTypes(responseDraft)
    })
  })
})
