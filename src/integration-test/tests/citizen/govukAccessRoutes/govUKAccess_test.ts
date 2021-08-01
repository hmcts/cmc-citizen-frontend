import I = CodeceptJS.I
import { AccessRoutesSteps } from 'integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps'
import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'

const accessRoutesSteps: AccessRoutesSteps = new AccessRoutesSteps()
let claimantEmail
let claimRef

Feature('GovUK Access Routes - Return & Respond To Claim E2E')

Before(async (I: I) => {
  claimantEmail = await I.getClaimantEmail()
  claimRef = await I.createClaim(await createClaimData(I, PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)

})


