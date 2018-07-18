import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'
import {ChooseHowToProceed} from "claimant-response/form/models/chooseHowToProceed";

export class DraftClaimantResponse extends DraftDocument {

  chooseHowToRespond?: ChooseHowToProceed

  constructor () {
    super()
  }

  deserialize (input: any): DraftClaimantResponse {
    if (input) {
      this.externalId = input.externalId
      this.chooseHowToRespond = input.chooseHowToRespond
    }
    return this
  }
}
