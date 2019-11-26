import { PartyType } from 'integration-test/data/party-type'
import { claimAmount, createClaimData } from 'integration-test/data/test-data'
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
import I = CodeceptJS.I
import { AmountHelper } from 'integration-test/helpers/amountHelper'
import { DashboardClaimDetails } from 'integration-test/tests/citizen/defence/pages/defendant-claim-details'

const claimSteps: ClaimSteps = new ClaimSteps()
const dashboardClaimDetails: DashboardClaimDetails = new DashboardClaimDetails()

Feature('Dashboard')

Scenario('Check newly created claim is in my account dashboard with correct claim amount @citizen', { retries: 3 }, async (I: I) => {
  const email: string = await I.createCitizenUser()
  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await claimSteps.makeAClaimAndSubmit(email, PartyType.COMPANY, PartyType.INDIVIDUAL, false)
  I.waitForOpenClaim(claimRef)
  I.click('My account')
  I.see('Your money claims account')
  I.see(claimRef + ' ' + `${claimData.defendants[0].title} ${claimData.defendants[0].firstName} ${claimData.defendants[0].lastName}` + ' ' + AmountHelper.formatMoney(claimAmount.getTotal()))
  I.click(claimRef)
  I.see('Claim number:')
  I.see(claimRef)
  dashboardClaimDetails.clickViewClaim()
  dashboardClaimDetails.checkClaimData(claimRef, claimData)
})
