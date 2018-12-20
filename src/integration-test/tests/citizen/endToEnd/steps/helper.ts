import I = CodeceptJS.I
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { DefenceType } from 'integration-test/data/defence-type'
import { PaymentOption } from 'integration-test/data/payment-option'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'

const I: I = actor()
const defenceSteps: DefenceSteps = new DefenceSteps()
const claimDetailsHeading: string = 'Claim details'

export class Helper {

  async enterPinNumber (claimRef: string, claimantEmail: string): Promise<void> {
    defenceSteps.enterClaimReference(claimRef)
    I.waitForText('Security code')
    const authorisation = await IdamClient.authenticateUser(claimantEmail)
    return defenceSteps.enterClaimPin(claimRef, authorisation)
  }

  linkClaimToDefendant (defendantEmail: string): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(defendantEmail)
  }

  startResponseFromDashboard (claimRef: string): void {
    I.click(claimRef)
    I.click('Respond to claim')
  }

  finishResponse (
    testData: EndToEndTestData,
    isRequestMoreTimeToRespond: boolean = true
  ): void {
    if (testData.defenceType === undefined) {
      testData.defenceType = DefenceType.FULL_REJECTION_WITH_DISPUTE
    }
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(testData.defendantEmail)
    I.click(testData.claimRef)
    I.click('Respond to claim')
    defenceSteps.makeDefenceAndSubmit(
      testData.defendant,
      testData.defendantEmail,
      testData.defendantPartyType,
      testData.defenceType,
      isRequestMoreTimeToRespond,
      testData.defendantClaimsToHavePaidInFull
    )
  }

  // TODO: refactor with above ^^^
  finishResponseWithFullAdmission (testData: EndToEndTestData): void {
    if (testData.paymentOption === undefined) {
      testData.paymentOption = PaymentOption.IMMEDIATELY
    }
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(testData.defendantEmail)
    I.click(testData.claimRef)
    I.click('Respond to claim')
    defenceSteps.makeFullAdmission(testData.defendant, testData.defendantPartyType, testData.paymentOption, testData.claimantName)
  }

  finishResponseWithHandOff (claimRef: string, defendant: Party, claimant: Party, defendantEmail: string, defenceType: DefenceType): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(defendantEmail)
    I.click(claimRef)
    defenceSteps.sendDefenceResponseHandOff(claimRef, defendant, claimant, defenceType)
  }

  defendantViewCaseTaskList (defendantEmail: string): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(defendantEmail)
  }
}
