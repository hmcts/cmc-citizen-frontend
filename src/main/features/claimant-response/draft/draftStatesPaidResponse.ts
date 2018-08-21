import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import { ClaimSettled } from 'claimant-response/form/models/states-paid/claimSettled'
import { RejectReason } from 'claimant-response/form/models/states-paid/rejectReason'
import { PartPaymentReceived } from 'claimant-response/form/models/states-paid/partPaymentReceived'
import { FreeMediation } from 'claimant-response/form/models/states-paid/freeMediation'

export class DraftStatesPaidResponse extends DraftDocument {

  defendantResponseViewed?: boolean
  partPaymentReceived?: PartPaymentReceived
  accepted?: ClaimSettled
  disputeReason?: RejectReason
  freeMediation?: FreeMediation

  constructor () {
    super()
  }

  deserialize (input: any): DraftStatesPaidResponse {
    if (input) {
      if (input.defendantResponseViewed) {
        this.defendantResponseViewed = input.defendantResponseViewed
      }

      if (input.partPaymentReceived) {
        this.partPaymentReceived = new PartPaymentReceived().deserialize(input.partPaymentReceived)
      }

      if (input.accepted) {
        this.accepted = new ClaimSettled().deserialize(input.accepted)
      }

      if (input.disputeReason) {
        this.disputeReason = new RejectReason().deserialize(input.disputeReason)
      }

      if (input.freeMediation) {
        this.freeMediation = new FreeMediation().deserialize(input.freeMediation)
      }
    }
    return this
  }
}
