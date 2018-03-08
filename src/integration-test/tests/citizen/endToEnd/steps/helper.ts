import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { DefenceType } from 'integration-test/data/defence-type'

const I: I = actor()
const defenceSteps: DefenceSteps = new DefenceSteps()
const claimDetailsHeading: string = 'Claim details'

export class Helper {

  async enterPinNumber (claimRef: string, authorisation : string): Promise<void> {
    defenceSteps.enterClaimReference(claimRef)
    I.waitForText('Please enter your security code to continue')
    defenceSteps.enterClaimPin(claimRef, authorisation)
  }

  finishResponse (defendantEmail: string, defendantType: PartyType, defenceType: DefenceType = DefenceType.FULL_REJECTION_WITH_DISPUTE): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(defendantEmail)
    defenceSteps.makeDefenceAndSubmit(defendantEmail, defendantType, defenceType)
  }

  finishResponseWithHandOff (claimRef: string, defendant: Party, claimant: Party, defendantEmail: string, defenceType: DefenceType): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(defendantEmail)
    defenceSteps.sendDefenceResponseHandOff(claimRef, defendant, claimant, defenceType)
  }

  defendantViewCaseTaskList (defendantEmail: string): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(defendantEmail)
  }
}
