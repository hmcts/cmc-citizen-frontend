import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { createClaimant, createDefendant, createClaimData } from 'integration-test/data/test-data'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefendantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/defendant'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const defendantResponseSteps: DefendantResponseSteps = new DefendantResponseSteps()

Feature('Claimant Response').retry(3)

// TODO: reuse - similar to a few places
async function prepareClaim (I: I, claimData: ClaimData) {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()
  const claimRef: string = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)

  return {
    'defendantEmail': defendantEmail,
    'claimantEmail': claimantEmail,
    'claimRef': claimRef
  }
}

Scenario('As a claimant I can reject the claim @citizen',
  async (I: I) => {

    const defendantName = createDefendant(PartyType.INDIVIDUAL).name
    const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    const claim = await prepareClaim(I, claimData)

    // as defendant
    defendantResponseSteps.disputeAllClaim(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL)
    I.see(claim.claimRef)
    // check dashboard
    I.click('My account')
    I.see('You’ve rejected the claim. You need to tell us more about the claim.')
    // check status
    I.click(claim.claimRef)
    I.see(claim.claimRef)
    I.see('Claim status')
    I.see('You’ve rejected the claim and said you don’t want to use mediation to solve it.')
    I.click('Sign out')

    // as claimant
    userSteps.login(claim.claimantEmail)
    claimantResponseSteps.viewClaimFromDashboard(claim.claimRef, false)
    // check dashboard
    I.click('My account')
    I.see(claim.claimRef)
    I.see(`${defendantName} has rejected your claim.`)
    // check status
    I.click(claim.claimRef)
    I.see(claim.claimRef)
    I.see('Claim status')
    I.see('The defendant has rejected your claim')
    I.see(`They said they dispute your claim.`)
    I.click('Sign out')
  })

Scenario(
  'As a claimant I can reject the claim as I have paid less than the amount claimed @citizen @not-complete',
  async (I: I) => {

    const claimantName = createClaimant(PartyType.INDIVIDUAL).name
    const defendantName = createDefendant(PartyType.INDIVIDUAL).name
    const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    const claim = await prepareClaim(I, claimData)

    // as defendant
    defendantResponseSteps.disputeClaimAsAlreadyPaid(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL, 50, false)
    I.see(claim.claimRef)
    I.see(`You told us you’ve paid the £${Number(50).toLocaleString()} you believe you owe. We’ve sent ${claimantName} this response.`)
    // check dashboard
    I.click('My account')
    I.see(`We’ve emailed ${claimantName} telling them when and how you said you paid the claim.`)
    // check status
    I.click(claim.claimRef)
    I.see(claim.claimRef)
    I.see('Claim status')
    I.see(`We’ve emailed ${claimantName} telling them when and how you said you paid the claim.`)
    I.click('Sign out')

    // as claimant
    userSteps.login(claim.claimantEmail)
    claimantResponseSteps.viewClaimFromDashboard(claim.claimRef, false)
    // check dashboard
    I.click('My account')
    I.see(claim.claimRef)
    I.see(`The defendant believes they owe you £50. You can accept or reject that this is the amount owed.`) // TODO IS THIS WRONG? should be defendants name
    // check status
    I.click(claim.claimRef)
    I.see(claim.claimRef)
    I.see('Claim status')
    I.see('The defendant’s response')
    I.see(`${defendantName} says they paid you £50 on 1 January 2018.`)
    // TODO: accept or reject the response - implemented yet?
    I.click('Sign out')
  })

Scenario(
  'As a claimant I can reject the claim as I have paid the amount claimed in full including any fees @citizen',
  async (I: I) => {

    const claimantName = createClaimant(PartyType.INDIVIDUAL).name
    const defendantName = createDefendant(PartyType.INDIVIDUAL).name
    const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    const claim = await prepareClaim(I, claimData)
    // as defendant
    defendantResponseSteps.disputeClaimAsAlreadyPaid(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL, 125, true)
    I.see(claim.claimRef)
    I.see(`We’ve emailed ${claimantName} your response, explaining why you reject the claim.`)
    // check dashboard
    I.click('My account')
    I.see(`We’ve emailed ${claimantName} telling them when and how you said you paid the claim.`)
    // check status
    I.click(claim.claimRef)
    I.see(claim.claimRef)
    I.see('Claim status')
    I.see(`We’ve emailed ${claimantName} telling them when and how you said you paid the claim.`)
    I.click('Sign out')

    // as claimant
    userSteps.login(claim.claimantEmail)
    claimantResponseSteps.viewClaimFromDashboard(claim.claimRef, false)
    // check dashboard
    I.click('My account')
    I.see(claim.claimRef)
    I.see(`${defendantName} believes that they’ve paid the claim in full.`)
    // check status
    I.click(claim.claimRef)
    I.see(claim.claimRef)
    I.see('Claim status')
    I.see('The defendant’s response')
    I.see(`${defendantName} believes that they’ve paid the claim in full.`)
    I.click('Sign out')
  })
