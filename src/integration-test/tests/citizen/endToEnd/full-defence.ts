import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { EndToEndTestData } from './data/EndToEndTestData'
import { DefenceType } from '../../../data/defence-type'
import { UserSteps } from '../home/steps/user'
import { ClaimantResponseSteps } from '../claimantResponse/steps/claimant-reponse'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()

Feature('E2E tests for defence journeys')

Scenario('I can as an Individual make a claim against an Individual who then fully defends and I proceed with the claim @citizen', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.defenceType = DefenceType.FULL_REJECTION_WITH_DISPUTE
  testData.defendantClaimsToHavePaidInFull = true
  helperSteps.finishResponse(testData)

  I.see(testData.claimRef)
  // check dashboard
  I.click('My account')
  // check status
  I.click(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Claim status')
  if (process.env.FEATURE_MEDIATION === 'true') {
    I.see('Your response to the claim')
    I.see('You have rejected the claim')
  } else {
    I.see('You’ve rejected the claim and said you don’t want to use mediation to solve it.')
  }
  I.click('Sign out')

  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Claim status')
  if (process.env.FEATURE_MEDIATION === 'true') {
    I.see('Decide whether to proceed')
    I.see('Mrs. Rose Smith has rejected your claim.')
    I.click('View and respond')
    claimantResponseSteps.decideToProceed()
  } else {
    I.see('The defendant has rejected your claim')
    I.see(`They said they dispute your claim.`)
  }
  I.click('Sign out')
})
