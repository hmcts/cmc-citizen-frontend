import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import I = CodeceptJS.I
import { DefenceType } from 'integration-test/data/defence-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()

let claimantEmail
let defendantEmail
let claimData
let defendant
let claimant
let claimRef

Feature('Respond to claim: handoff journey')

Before(async (I: I) => {
  claimantEmail = userSteps.getClaimantEmail()
  defendantEmail = userSteps.getDefendantEmail()

  claimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  defendant = claimData.defendants[0]
  claimant = claimData.claimants[0]

  claimRef = await I.createClaim(claimData, claimantEmail, true, [])

})

Scenario('I can see send your response by email page when I reject all of the claim with counter claim @citizen', { retries: 3 }, async (I: I) => {
  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponseWithHandOff(claimRef, defendant, claimant, defendantEmail, DefenceType.FULL_REJECTION_WITH_COUNTER_CLAIM)
}).retry(2)

Scenario('I can see send your response by email page when I reject all of the claim with amount paid less than claimed amount @nightly', { retries: 3 }, async (I: I) => {
  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponseWithHandOff(claimRef, defendant, claimant, defendantEmail, DefenceType.FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT
  )
})
