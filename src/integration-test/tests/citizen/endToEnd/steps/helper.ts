import I = CodeceptJS.I
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { DefenceType } from 'integration-test/data/defence-type'
import { PaymentOption } from 'integration-test/data/payment-option'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const I: I = actor()
const defenceSteps: DefenceSteps = new DefenceSteps()
const userSteps: UserSteps = new UserSteps()

export class Helper {

  async enterPinNumber (claimRef: string, claimantEmail: string): Promise<void> {
    defenceSteps.enterClaimReference(claimRef)
    return Promise.resolve()
  }

  linkClaimToDefendant (defendantEmail: string): void {
    defenceSteps.loginAsDefendant(defendantEmail)
  }

  startResponseFromDashboard (claimRef: string): void {
    I.click(claimRef)
    I.click('Respond to claim')
  }

  finishResponse (
    testData: EndToEndTestData,
    isRequestMoreTimeToRespond: boolean = true,
    expectPhonePage: boolean = false
  ): void {
    if (testData.defenceType === undefined) {
      testData.defenceType = DefenceType.FULL_REJECTION_WITH_DISPUTE
    }
    defenceSteps.loginAsDefendant(testData.defendantEmail)
    userSteps.prepareAuthenticatedUser(testData.defendantEmail)
    I.click(testData.claimRef)
    I.click('Respond to claim')
    defenceSteps.makeDefenceAndSubmit(
      testData.defendant,
      testData.defendantEmail,
      testData.defendantPartyType,
      testData.defenceType,
      isRequestMoreTimeToRespond,
      testData.defendantClaimsToHavePaidInFull,
      expectPhonePage
    )
  }

  // TODO: refactor with above ^^^
  finishResponseWithFullAdmission (testData: EndToEndTestData): void {
    if (testData.paymentOption === undefined) {
      testData.paymentOption = PaymentOption.IMMEDIATELY
    }
    defenceSteps.loginAsDefendant(testData.defendantEmail)
    userSteps.prepareAuthenticatedUser(testData.defendantEmail)
    I.click(testData.claimRef)
    I.click('Respond to claim')
    defenceSteps.makeFullAdmission(testData.defendant, testData.defendantPartyType, testData.paymentOption, testData.claimantName, false)
  }

  finishResponseWithHandOff (claimRef: string, defendant: Party, claimant: Party, defendantEmail: string, defenceType: DefenceType): void {
    defenceSteps.loginAsDefendant(defendantEmail)
    I.click(claimRef)
    defenceSteps.sendDefenceResponseHandOff(claimRef, defendant, claimant, defenceType)
  }

  defendantViewCaseTaskList (defendantEmail: string): void {
    defenceSteps.loginAsDefendant(defendantEmail)
  }
}
