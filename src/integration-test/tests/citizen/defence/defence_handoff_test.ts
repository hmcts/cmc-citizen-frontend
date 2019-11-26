import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import I = CodeceptJS.I
import { DefenceType } from 'integration-test/data/defence-type'

const helperSteps: Helper = new Helper()

Feature('Respond to claim: handoff journey')

Scenario('I can see send your response by email page when I reject all of the claim with counter claim @citizen', { retries: 3 }, async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const defendant: Party = claimData.defendants[0]
  const claimant: Party = claimData.claimants[0]

  const claimRef: string = await I.createClaimWithFeatures(claimData, claimantEmail, [])

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponseWithHandOff(claimRef, defendant, claimant, defendantEmail, DefenceType.FULL_REJECTION_WITH_COUNTER_CLAIM)
})

Scenario('I can see send your response by email page when I reject all of the claim with amount paid less than claimed amount @nightly', { retries: 3 }, async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const defendant: Party = claimData.defendants[0]
  const claimant: Party = claimData.claimants[0]

  const claimRef: string = await I.createClaimWithFeatures(claimData, claimantEmail, [])

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponseWithHandOff(claimRef, defendant, claimant, defendantEmail, DefenceType.FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT
  )
})
