import { PartyType } from 'integration-test/data/party-type'
import { claimAmount, createClaimData, createDefendant } from 'integration-test/data/test-data'
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
import I = CodeceptJS.I
import { AmountHelper } from 'integration-test/helpers/amountHelper'
import { DashboardClaimDetails } from 'integration-test/tests/citizen/defence/pages/defendant-claim-details'

const claimSteps: ClaimSteps = new ClaimSteps()
const dashboardClaimDetails: DashboardClaimDetails = new DashboardClaimDetails()

Feature('Dashboard').retry(3)

Scenario('Check newly created claim is in my account dashboard with correct claim amount @citizen', async (I: I) => {
  const email: string = await I.createCitizenUser()
  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await claimSteps.makeAClaimAndSubmit(email, PartyType.COMPANY, PartyType.INDIVIDUAL, false)

  I.click('My account')
  I.see('Your money claims account')
  I.see(claimRef + ' ' + createDefendant(PartyType.INDIVIDUAL).name + ' ' + AmountHelper.formatMoney(claimAmount.getTotal()))
  I.click(claimRef)
  I.see('Claim number:')
  I.see(claimRef)
  I.see('Claim status')
  dashboardClaimDetails.clickViewClaim()
  dashboardClaimDetails.checkClaimData(claimRef, claimData)
})
