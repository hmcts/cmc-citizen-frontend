import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { PaymentOption } from 'integration-test/data/payment-option'
import { DefenceType } from 'integration-test/data/defence-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { Moment } from 'moment'

const helperSteps: Helper = new Helper()

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
  ) {
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

  private static async prepare (
    I: I,
    defendantPartyType: PartyType,
    claimantPartyType: PartyType,
    claimData: ClaimData
  ) {
    const claimantEmail: string = await I.createCitizenUser()
    const defendantEmail: string = await I.createCitizenUser()

    const claimRef: string = await I.createClaimWithFeaturesAndRole(claimData, claimantEmail, 'cmc-new-features-consent-given', ['admissions', 'directionsQuestionnaire'])
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
