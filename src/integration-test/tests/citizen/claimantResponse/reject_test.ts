import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { DefendantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/defendant'
import { ClaimantResponseTestData } from 'integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'

const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const defendantResponseSteps: DefendantResponseSteps = new DefendantResponseSteps()

if (process.env.FEATURE_ADMISSIONS === 'true') {
  Feature('Claimant Response: Reject')

  Scenario('As a claimant I can reject the claim @citizen @admissions', { retries: 3 },
    async (I: I) => {

      const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
      const claimantResponseTestData = new ClaimantResponseTestData()

      // as defendant
      defendantResponseSteps.disputeAllClaim(testData, claimantResponseTestData)
      I.see(testData.claimRef)
      // check dashboard
      I.click('My account')
      // check status
      I.click(testData.claimRef)
      I.see(testData.claimRef)
      I.see('Claim status')
      if (process.env.FEATURE_MEDIATION === 'true') {
        I.see('Wait for the claimant to respond')
        I.see('You’ve rejected the claim')
      } else {
        I.see('You’ve rejected the claim and said you don’t want to use mediation to solve it.')
      }
      I.click('Sign out')

      // as claimant
      userSteps.login(testData.claimantEmail)
      claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
      // check dashboard
      I.click('My account')
      I.see(testData.claimRef)
      // check status
      I.click(testData.claimRef)
      I.see(testData.claimRef)
      I.see('Claim status')
      if (process.env.FEATURE_MEDIATION === 'true') {
        I.see('Decide whether to proceed')
        I.see('Mrs. Rose Smith has rejected your claim.')
      } else {
        I.see('The defendant has rejected your claim')
        I.see(`They said they dispute your claim.`)
      }
      I.click('Sign out')
    })

  Scenario(
    'As a claimant I can reject the claim as I have paid less than the amount claimed @nightly @admissions', { retries: 3 },
    async (I: I) => {

      const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
      const claimantResponseTestData = new ClaimantResponseTestData()
      claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation = {
        paidAmount: 50,
        date: '2018-01-01',
        explanation: 'My explanation...'
      }
      // as defendant
      defendantResponseSteps.disputeClaimAsAlreadyPaid(testData, claimantResponseTestData, false)
      I.see(testData.claimRef)
      I.see(`You told us you’ve paid the £${Number(50).toLocaleString()} you believe you owe. We’ve sent ${testData.claimantName} this response.`)
      // check dashboard
      I.click('My account')
      I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`)
      // check status
      I.click(testData.claimRef)
      I.see(testData.claimRef)
      I.see('Claim status')
      I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`)
      I.click('Sign out')
      // as claimant
      userSteps.login(testData.claimantEmail)
      claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
      // check dashboard
      I.click('My account')
      I.see(testData.claimRef)
      I.see(`Respond to the defendant.`) // TODO IS THIS WRONG? should be defendants name
      // check status
      I.click(testData.claimRef)
      I.see(testData.claimRef)
      I.see('Claim status')
      I.see('Respond to the defendant')
      I.see(`${testData.defendantName} says they paid you £50 on 1 January 2018.`)
      // TODO: accept or reject the response - implemented yet?
      I.click('Sign out')
    })

  Scenario(
    'As a claimant I can reject the claim as I have paid the amount claimed in full including any fees @citizen @admissions', { retries: 3 },
    async (I: I) => {

      const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
      const claimantResponseTestData = new ClaimantResponseTestData()
      claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation = {
        paidAmount: 125,
        date: '2018-01-01',
        explanation: 'My explanation...'
      }
      // as defendant
      defendantResponseSteps.disputeClaimAsAlreadyPaid(testData, claimantResponseTestData, true)
      I.see(testData.claimRef)
      I.see(`You told us you’ve paid £125. We’ve sent ${testData.claimantName} this response`)
      // check dashboard
      I.click('My account')
      I.see('Wait for the claimant to respond')
      // check status
      I.click(testData.claimRef)
      I.see(testData.claimRef)
      I.see('Claim status')
      I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`)
      I.click('Sign out')
      // as claimant
      userSteps.login(testData.claimantEmail)
      claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
      // check dashboard
      I.click('My account')
      I.see(testData.claimRef)
      I.see('Decide whether to proceed')
      // check status
      I.click(testData.claimRef)
      I.see(testData.claimRef)
      I.see('Claim status')
      I.see('Decide whether to proceed')
      I.see(`${testData.defendantName} has rejected your claim.`)
      I.click('Sign out')
    })
}
