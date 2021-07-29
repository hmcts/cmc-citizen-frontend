import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import I = CodeceptJS.I
import { DefenceType } from 'integration-test/data/defence-type'
const helperSteps: Helper = new Helper()

let claimantEmail
let defendantEmail
let claimData
let defendant
let claimant
let claimRef

Feature('Respond to claim: handoff journey')

Before(async (I: I) => {
  claimantEmail = await I.getClaimantEmail()
  defendantEmail = await I.getDefendantEmail()
  claimData = await createClaimData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  defendant = claimData.defendants[0]
  claimant = claimData.claimants[0]
  claimRef = await I.createClaim(claimData, claimantEmail, true, [])
  await helperSteps.enterPinNumber(claimRef, claimantEmail)

})
