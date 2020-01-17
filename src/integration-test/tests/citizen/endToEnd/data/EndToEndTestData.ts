import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { PaymentOption } from 'integration-test/data/payment-option'
import { DefenceType } from 'integration-test/data/defence-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { Moment } from 'moment'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()

export class EndToEndTestData {

  claimRef: string
  defendant: Party
  defendantName: string
  defendantEmail: string
  defendantPartyType: PartyType
  paymentOption: PaymentOption
  defenceType: DefenceType
  claimant: Party
  claimantName: string
  claimantEmail: string
  claimantPartyType: PartyType
  claimantPaymentOption: PaymentOption
  defendantClaimsToHavePaidInFull: boolean
  moneyReceivedOn: Moment

  public static async prepareData (
    I: I,
    defendantPartyType: PartyType,
    claimantPartyType: PartyType
  ): EndToEndTestData {
    const claimData: ClaimData = createClaimData(claimantPartyType, defendantPartyType)
    return this.prepare(I, defendantPartyType, claimantPartyType, claimData)
  }

  public static async prepareDataWithNoDefendantEmail (
    I: I,
    defendantPartyType: PartyType,
    claimantPartyType: PartyType
  ) {
    const claimData: ClaimData = createClaimData(claimantPartyType, defendantPartyType, false)
    return this.prepare(I, defendantPartyType, claimantPartyType, claimData)
  }

  private static async prepare(
    I: I,
    defendantPartyType: PartyType,
    claimantPartyType: PartyType,
    claimData: ClaimData
  ): EndToEndTestData {
    const claimantEmail: string = userSteps.getClaimantEmail()
    const defendantEmail: string = userSteps.getDefendantEmail()

    const claimRef: string = await I.createClaim(claimData, claimantEmail, true, ['admissions','directionsQuestionnaire'],'cmc-new-features-consent-given')
    await helperSteps.enterPinNumber(claimRef, claimantEmail)

    const testData = new EndToEndTestData()
    testData.defendantClaimsToHavePaidInFull = true
    testData.defendantName = (defendantPartyType === PartyType.INDIVIDUAL || PartyType.SOLE_TRADER) ?
      `${claimData.defendants[0].title} ${claimData.defendants[0].firstName} ${claimData.defendants[0].lastName}` :
      claimData.defendants[0].name
    testData.defendant = claimData.defendants[0]
    testData.claimantName = claimData.claimants[0].name
    testData.claimant = claimData.claimants[0]
    testData.claimRef = claimRef
    testData.claimantEmail = claimantEmail
    testData.defendantEmail = defendantEmail
    testData.defendantPartyType = defendantPartyType
    testData.claimantPartyType = claimantPartyType
    return testData
  }

}
