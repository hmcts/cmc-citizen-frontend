/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { LocalDate } from 'forms/models/localDate'

import { FullAdmission, PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'

import { Response } from 'response/form/models/response'
import { ResponseType } from 'response/form/models/responseType'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { MoreTimeNeeded, MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { PartyType } from 'common/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import {
  fullAdmissionWithImmediatePaymentDraft,
  partialAdmissionWithImmediatePaymentDraft,
  statementOfMeansWithAllFieldsDraft
} from 'test/data/draft/responseDraft'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'

describe('ResponseDraft', () => {

  describe('deserialization', () => {

    it('should return a ResponseDraft instance initialised with defaults for undefined', () => {
      expect(new ResponseDraft().deserialize(undefined)).to.eql(new ResponseDraft())
    })

    it('should return a ResponseDraft instance initialised with defaults for null', () => {
      expect(new ResponseDraft().deserialize(null)).to.eql(new ResponseDraft())
    })

    it('should return a ResponseDraft instance initialised with valid data (defence)', () => {
      const responseType: ResponseType = ResponseType.DEFENCE

      const draft: ResponseDraft = new ResponseDraft().deserialize({
        response: {
          type: {
            value: responseType.value,
            displayValue: responseType.displayValue
          }
        },
        moreTimeNeeded: {
          option: MoreTimeNeededOption.YES
        },
        impactOfDispute: {
          text: 'This dispute has affected me badly, I cried'
        },
        freeMediation: {
          option: FreeMediationOption.YES
        }
      })

      expect(draft.response.type).to.eql(responseType)
      expect(draft.moreTimeNeeded.option).to.eql(MoreTimeNeededOption.YES)
      expect(draft.freeMediation.option).to.eql(FreeMediationOption.YES)
      expect(draft.impactOfDispute.text).to.equal('This dispute has affected me badly, I cried')
    })

    it('should return a ResponseDraft instance initialised with valid data (full admission)', () => {
      const responseType: ResponseType = ResponseType.PART_ADMISSION
      const paymentDate: Partial<LocalDate> = {
        year: 1988,
        month: 2,
        day: 10
      }

      const draft: ResponseDraft = new ResponseDraft().deserialize({
        response: {
          type: {
            value: responseType.value,
            displayValue: responseType.displayValue
          }
        },
        moreTimeNeeded: {
          option: MoreTimeNeededOption.YES
        },
        fullAdmission: {
          paymentIntention: {
            paymentOption: {
              option: {
                value: 'BY_SPECIFIED_DATE'
              }
            },
            paymentDate: {
              date: paymentDate
            }
          }
        },
        statementOfMeans: {
          residence: {
            type: {
              value: ResidenceType.OTHER.value,
              displayValue: ResidenceType.OTHER.displayValue
            },
            housingDetails: 'Squat'
          }
        },
        freeMediation: {
          option: FreeMediationOption.YES
        }
      })

      expect(draft.response.type).to.eql(responseType)
      expect(draft.moreTimeNeeded.option).to.eql(MoreTimeNeededOption.YES)
      expect(draft.freeMediation.option).to.eql(FreeMediationOption.YES)
      assertLocalDateEquals(draft.fullAdmission.paymentIntention.paymentDate.date, paymentDate)
      expect(draft.statementOfMeans.residence.type).to.eql(ResidenceType.OTHER)
    })

    it('should return not have statement of means populated when immediate payment is declared (full admission)', () => {
      const draft: ResponseDraft = new ResponseDraft().deserialize({
        ...fullAdmissionWithImmediatePaymentDraft,
        statementOfMeans: {
          ...statementOfMeansWithAllFieldsDraft
        }
      })
      expect(draft.statementOfMeans).to.be.undefined
    })

    it('should return not have statement of means populated when immediate payment is declared (partial admission)', () => {
      const draft: ResponseDraft = new ResponseDraft().deserialize({
        ...partialAdmissionWithImmediatePaymentDraft,
        statementOfMeans: {
          ...statementOfMeansWithAllFieldsDraft
        }
      })
      expect(draft.statementOfMeans).to.be.undefined
    })
  })

  describe('isMoreTimeRequested', () => {
    it('should return false when instantiated with no input', () => {
      const draft: ResponseDraft = new ResponseDraft()

      expect(draft.moreTimeNeeded).to.be.eql(undefined)
      expect(draft.isMoreTimeRequested()).to.be.eq(false)
    })

    it('should return false when more time was not requested', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.moreTimeNeeded = new MoreTimeNeeded(MoreTimeNeededOption.NO)

      expect(draft.moreTimeNeeded.option).to.be.eq(MoreTimeNeededOption.NO)
      expect(draft.isMoreTimeRequested()).to.be.eq(false)
    })

    it('should return true when more time was requested', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.moreTimeNeeded = new MoreTimeNeeded(MoreTimeNeededOption.YES)

      expect(draft.moreTimeNeeded.option).to.be.eq(MoreTimeNeededOption.YES)
      expect(draft.isMoreTimeRequested()).to.be.eq(true)
    })
  })

  describe('isResponseFullyAdmitted', () => {
    it('should return false when no response type or defendantDetails is set', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined
      draft.defendantDetails.partyDetails = undefined

      expect(draft.isResponseFullyAdmitted()).to.be.eq(false)
    })

    it('should return false when response is not full admission', () => {
      ResponseType.except(ResponseType.FULL_ADMISSION).forEach(responseType => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(responseType)

        expect(draft.isResponseFullyAdmitted()).to.be.eq(false)
      })
    })

    it('should return true when response is a full admission', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.FULL_ADMISSION)
      draft.defendantDetails.partyDetails = new PartyDetails()
      draft.defendantDetails.partyDetails.type = PartyType.INDIVIDUAL.value

      expect(draft.isResponseFullyAdmitted()).to.be.eq(true)
    })
  })

  describe('isResponseFullyAdmittedWithInstalments', () => {
    it('should return false when no response type set', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined

      expect(draft.isResponseFullyAdmittedWithInstalments()).to.be.eq(false)
    })

    it('should return false when response is not full admission', () => {
      ResponseType.except(ResponseType.FULL_ADMISSION).forEach(responseType => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(responseType)

        expect(draft.isResponseFullyAdmittedWithInstalments()).to.be.eq(false)
      })
    })

    it('should return false when response is full admission but payment option is not instalments', () => {
      PaymentType.except(PaymentType.INSTALMENTS).forEach(paymentType => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(ResponseType.FULL_ADMISSION)
        draft.fullAdmission = new FullAdmission()
        draft.fullAdmission.paymentIntention = new PaymentIntention()
        draft.fullAdmission.paymentIntention.paymentOption = new PaymentOption(paymentType)

        expect(draft.isResponseFullyAdmittedWithInstalments()).to.be.eq(false)
      })
    })

    it('should return true when response is full admission and payment option is instalments', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.FULL_ADMISSION)
      draft.fullAdmission = new FullAdmission()
      draft.fullAdmission.paymentIntention = new PaymentIntention()
      draft.fullAdmission.paymentIntention.paymentOption = new PaymentOption(PaymentType.INSTALMENTS)

      expect(draft.isResponseFullyAdmitted()).to.be.eq(true)
    })
  })

  describe('isResponsePartiallyAdmitted', () => {

    context('should return false when', () => {

      it('no response set', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = undefined

        expect(draft.isResponsePartiallyAdmitted()).to.be.eq(false)
      })

      it('response type is fully admitted', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = {
          type: ResponseType.FULL_ADMISSION
        }

        expect(draft.isResponsePartiallyAdmitted()).to.be.eq(false)
      })

      it('partial admission is not populated', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = {
          type: ResponseType.FULL_ADMISSION
        }
        draft.partialAdmission = undefined

        expect(draft.isResponsePartiallyAdmitted()).to.be.eq(false)
      })
    })

    it('should return true when type is PART_ADMISSION and partial admission is populated', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = {
        type: ResponseType.PART_ADMISSION
      }
      draft.partialAdmission = new PartialAdmission().deserialize({
        alreadyPaid: { option: { option: 'yes' } }
      })

      expect(draft.isResponsePartiallyAdmitted()).to.be.eq(true)
    })
  })

  describe('isResponsePartiallyAdmittedAndAlreadyPaid', () => {

    it('should return false when no response type set', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined

      expect(draft.isResponsePartiallyAdmittedAndAlreadyPaid()).to.be.equals(false)
    })

    it('should return true when partially admitted and already paid', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = {
        type: ResponseType.PART_ADMISSION
      }
      draft.partialAdmission = new PartialAdmission().deserialize({
        alreadyPaid: { option: { option: 'yes' } }
      })

      expect(draft.isResponsePartiallyAdmittedAndAlreadyPaid()).to.be.equals(true)
    })

    it('should return false when partially admitted and NOT already paid', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = {
        type: ResponseType.PART_ADMISSION
      }
      draft.partialAdmission = new PartialAdmission().deserialize({
        alreadyPaid: { option: { option: 'no' } }
      })

      expect(draft.isResponsePartiallyAdmittedAndAlreadyPaid()).to.be.equals(false)
    })

  })

  describe('isResponseRejectedFullyBecausePaidWhatOwed', () => {

    it('should return false when no response type set', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined

      expect(draft.isResponseRejectedFullyBecausePaidWhatOwed()).to.be.equals(false)
    })

    it('should return false when full rejection option is undefined', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.DEFENCE)
      draft.rejectAllOfClaim = undefined

      expect(draft.isResponseRejectedFullyBecausePaidWhatOwed()).to.be.equals(false)
    })

    it('should return true when response is full admission with already paid and amount claimed', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.DEFENCE)
      draft.rejectAllOfClaim = new RejectAllOfClaim(RejectAllOfClaimOption.ALREADY_PAID, new HowMuchHaveYouPaid(100))

      expect(draft.isResponseRejectedFullyBecausePaidWhatOwed()).to.be.equals(true)
    })
  })

  describe('isResponseRejectedFullyWithDispute', () => {

    it('should return false when no response type set', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined

      expect(draft.isResponseRejectedFullyWithDispute()).to.be.equals(false)
    })

    it('should return false when full rejection option is undefined', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.DEFENCE)
      draft.rejectAllOfClaim = undefined

      expect(draft.isResponseRejectedFullyWithDispute()).to.be.equals(false)
    })

    it('should return true when response is rejected with dispute', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.DEFENCE)
      draft.rejectAllOfClaim = new RejectAllOfClaim(RejectAllOfClaimOption.DISPUTE)

      expect(draft.isResponseRejectedFullyWithDispute()).to.be.equals(true)
    })
  })

  describe('isResponsePopulated', () => {
    it('should return true when response is populated', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.DEFENCE)

      expect(draft.isResponsePopulated()).to.be.equals(true)
    })

    it('should return false when response is not populated', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = undefined

      expect(draft.isResponsePopulated()).to.be.equals(false)
    })
  })

  describe('isResponseRejected', () => {

    context('should return false when', () => {

      it('response is not populated', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = undefined

        expect(draft.isResponseRejected()).to.be.equals(false)
      })

      it('response type is not populated', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(undefined)

        expect(draft.isResponseRejected()).to.be.equals(false)
      })

      it('response is PART_ADMISSION', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(ResponseType.PART_ADMISSION)

        expect(draft.isResponseRejected()).to.be.equals(false)
      })

      it('response is FULL_ADMISSION', () => {
        const draft: ResponseDraft = new ResponseDraft()
        draft.response = new Response(ResponseType.FULL_ADMISSION)

        expect(draft.isResponseRejected()).to.be.equals(false)
      })
    })

    it('should return true when response type is DEFENCE', () => {
      const draft: ResponseDraft = new ResponseDraft()
      draft.response = new Response(ResponseType.DEFENCE)

      expect(draft.isResponseRejected()).to.be.equals(true)
    })
  })

  function assertLocalDateEquals (actual: LocalDate, expected: any) {
    expect(actual.year).to.equal(expected.year)
    expect(actual.month).to.equal(expected.month)
    expect(actual.day).to.equal(expected.day)
  }
})
