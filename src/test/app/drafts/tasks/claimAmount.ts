// tslint:disable:no-unused-expression
import { expect, use } from 'chai'
import * as ChaiAsPromised from 'chai-as-promised'

import { DraftClaim } from 'drafts/models/draftClaim'
import { ClaimAmount } from 'drafts/tasks/claimAmount'
import { InterestRate } from 'claim/form/models/interestRate'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'
import { InterestEndDate, InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDateType } from 'common/interestDateType'
import { InterestDate } from 'claim/form/models/interestDate'
import { InterestStartDate } from 'claim/form/models/interestStartDate'
import { YesNoOption } from 'models/yesNoOption'

use(ChaiAsPromised)

describe('Claim amount', () => {

  describe('isCompleted', () => {

    it('should return true when the task is completed with no interest and no help with fees', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 1000
          }]
        },
        interest: {
          option: YesNoOption.NO
        },
        helpWithFees: {
          declared: YesNoOption.NO
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.eventually.be.true
    })

    it('should return true when the task is completed with no interest and yes to help with fees', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 1000
          }]
        },
        interest: {
          option: YesNoOption.NO
        },
        helpWithFees: {
          declared: YesNoOption.YES,
          helpWithFeesNumber: 'HWF01234'
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.eventually.be.true
    })

    it('should return true when the task is completed and an interest type has been selected', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 10000
          }]
        },
        interest: {
          option: YesNoOption.YES
        },
        interestType: {
          option: InterestTypeOption.SAME_RATE
        } as InterestType,
        interestRate: {
          type: InterestRateOption.DIFFERENT,
          rate: 10,
          reason: 'Special case'
        } as InterestRate,
        interestDate: {
          type: InterestDateType.SUBMISSION
        } as InterestDate,
        interestStartDate: {
          date: {
            day: 10,
            month: 12,
            year: 2016
          },
          reason: 'reason'
        } as InterestStartDate,
        interestEndDate: {
          option: InterestEndDateOption.SETTLED_OR_JUDGMENT
        } as InterestEndDate,
        helpWithFees: {
          declared: YesNoOption.NO
        }
      }

      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.eventually.be.true
    })

    it('should return false if total amount is not completed', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 0
          }]
        },
        interest: {
          option: YesNoOption.NO
        },
        helpWithFees: {
          declared: YesNoOption.NO
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.eventually.be.false
    })

    it('should return false if interest type has not been set', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 0
          }]
        },
        helpWithFees: {
          declared: YesNoOption.NO
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.eventually.be.false
    })

    it('should return false if help with fees has not been declared', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 0
          }]
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.eventually.be.false
    })

    it('should return false if help with fees has been declared YES but no number has been given', () => {
      const input = {
        amount: {
          rows: [{
            reason: 'Bills',
            amount: 0
          }]
        },
        helpWithFees: {
          declared: YesNoOption.YES
        }
      }
      const claim: DraftClaim = new DraftClaim().deserialize(input)
      expect(ClaimAmount.isCompleted(claim)).to.eventually.be.false
    })
  })
})
