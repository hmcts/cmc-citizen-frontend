import { PartyType } from 'integration-test/data/party-type'
import { InterestType } from 'integration-test/data/interest-type'
import { createClaimData, dailyInterestAmount } from 'integration-test/data/test-data'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import I = CodeceptJS.I
import { DashboardClaimDetails } from 'integration-test/tests/citizen/defence/pages/defendant-claim-details'

const helperSteps: Helper = new Helper()
const defendantDetails: DashboardClaimDetails = new DashboardClaimDetails()

Feature('Respond to claim: claim details')

Scenario('I can view the claim details from a link on the dashboard @citizen', async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.defendantViewCaseTaskList(defendantEmail)
  I.click(claimRef)
  I.click('Respond to claim')
  defendantDetails.clickViewClaim()
  defendantDetails.checkClaimData(claimRef, claimData)
}).retry(3)

Scenario('I can view the claim details from a link on the dashboard for interest breakdown @citizen', async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, true, InterestType.BREAKDOWN)
  const claimRef: string = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.defendantViewCaseTaskList(defendantEmail)
  I.click(claimRef)
  I.click('Respond to claim')
  defendantDetails.clickViewClaim()
  defendantDetails.checkClaimData(claimRef, claimData)
  I.see('Interest calculated with daily interest amount of £' + dailyInterestAmount + ' for 0 days')
}).retry(3)
