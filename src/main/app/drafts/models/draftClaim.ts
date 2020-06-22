import * as toBoolean from 'to-boolean'

import { Claimant } from 'drafts/models/claimant'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { InterestRate } from 'claim/form/models/interestRate'
import { InterestDate } from 'claim/form/models/interestDate'
import { Reason } from 'claim/form/models/reason'
import * as uuid from 'uuid'
import { Defendant } from 'drafts/models/defendant'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { QualifiedStatementOfTruth } from 'forms/models/qualifiedStatementOfTruth'
import { Eligibility } from 'eligibility/model/eligibility'
import { ClaimantTimeline } from 'claim/form/models/claimantTimeline'
import { Evidence } from 'forms/models/evidence'
import { Interest } from 'claim/form/models/interest'
import { InterestType } from 'claim/form/models/interestType'
import { InterestStartDate } from 'claim/form/models/interestStartDate'
import { InterestEndDate } from 'claim/form/models/interestEndDate'
import { InterestTotal } from 'claim/form/models/interestTotal'
import { InterestContinueClaiming } from 'claim/form/models/interestContinueClaiming'
import { InterestHowMuch } from 'claim/form/models/interestHowMuch'

export class DraftClaim extends DraftDocument {

  externalId = uuid()
  eligibility: boolean | Eligibility
  claimant: Claimant = new Claimant()
  defendant: Defendant = new Defendant()
  amount: ClaimAmountBreakdown = new ClaimAmountBreakdown()
  interest: Interest = new Interest()
  interestType: InterestType = new InterestType()
  interestRate: InterestRate = new InterestRate()
  interestDate: InterestDate = new InterestDate()
  interestStartDate: InterestStartDate = new InterestStartDate()
  interestEndDate: InterestEndDate = new InterestEndDate()
  interestTotal: InterestTotal = new InterestTotal()
  interestContinueClaiming: InterestContinueClaiming = new InterestContinueClaiming()
  interestHowMuch: InterestHowMuch = new InterestHowMuch()
  reason: Reason = new Reason()
  readResolveDispute: boolean = false
  readCompletingClaim: boolean = false
  qualifiedStatementOfTruth?: QualifiedStatementOfTruth
  timeline: ClaimantTimeline = new ClaimantTimeline()
  evidence: Evidence = new Evidence()

  deserialize (input: any): DraftClaim {
    if (input) {
      this.externalId = input.externalId
      this.claimant = new Claimant().deserialize(input.claimant)
      this.defendant = new Defendant().deserialize(input.defendant)
      this.interest = new Interest().deserialize(input.interest)
      this.interestType = new InterestType().deserialize(input.interestType)
      this.interestRate = new InterestRate().deserialize(input.interestRate)
      this.interestDate = new InterestDate().deserialize(input.interestDate)
      this.interestStartDate = new InterestStartDate().deserialize(input.interestStartDate)
      this.interestEndDate = new InterestEndDate().deserialize(input.interestEndDate)
      this.interestTotal = new InterestTotal().deserialize(input.interestTotal)
      this.interestContinueClaiming = new InterestContinueClaiming().deserialize(input.interestContinueClaiming)
      this.interestHowMuch = new InterestHowMuch().deserialize(input.interestHowMuch)
      this.amount = new ClaimAmountBreakdown().deserialize(input.amount)
      this.reason = new Reason().deserialize(input.reason)
      this.readResolveDispute = input.readResolveDispute
      this.readCompletingClaim = input.readCompletingClaim
      if (input.qualifiedStatementOfTruth) {
        this.qualifiedStatementOfTruth = new QualifiedStatementOfTruth().deserialize(input.qualifiedStatementOfTruth)
      }
      switch (typeof input.eligibility) {
        case 'boolean':
          this.eligibility = toBoolean(input.eligibility)
          break
        case 'object':
          this.eligibility = new Eligibility().deserialize(input.eligibility).eligible()
          break
      }
      this.timeline = new ClaimantTimeline().deserialize(input.timeline) as ClaimantTimeline
      this.evidence = new Evidence().deserialize(input.evidence) as Evidence
    }
    return this
  }
}
