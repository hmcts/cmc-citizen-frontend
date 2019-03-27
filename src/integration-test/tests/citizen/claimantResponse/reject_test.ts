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
  Feature('Claimant Response: Reject').retry(3)

  Scenario('As a claimant I can reject the claim @citizen @admissions',
    async (I: I) => {

      const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
      const claimantResponseTestData = new ClaimantResponseTestData()

      // as defendant
      defendantResponseSteps.disputeAllClaim(testData, claimantResponseTestData)
      I.see(testData.claimRef)
      // check dashboard
      I.click('My account')
      I.see('You’ve rejected the claim. You need to tell us more about the claim.')
      // check status
      I.click(testData.claimRef)
      I.see(testData.claimRef)
      I.see('Claim status')
      I.see('You’ve rejected the claim and said you don’t want to use mediation to solve it.')
      I.click('Sign out')

      // as claimant
      userSteps.login(testData.claimantEmail)
      claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
      // check dashboard
      I.click('My account')
      I.see(testData.claimRef)
      I.see(`${testData.defendantName} has rejected your claim.`)
      // check status
      I.click(testData.claimRef)
      I.see(testData.claimRef)
      I.see('Claim status')
      I.see('The defendant has rejected your claim')
      I.see(`They said they dispute your claim.`)
      I.click('Sign out')
    })

  Scenario(
    'As a claimant I can reject the claim as I have paid less than the amount claimed @citizen @admissions',
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
      I.see('The defendant’s response')
      I.see(`${testData.defendantName} says they paid you £50 on 1 January 2018.`)
      // TODO: accept or reject the response - implemented yet?
      I.click('Sign out')
    })

  Scenario(
    'As a claimant I can reject the claim as I have paid the amount claimed in full including any fees @citizen @admissions',
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
      I.see(`We’ve emailed ${testData.claimantName} your response, explaining why you reject the claim.`)
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
      I.see(`${testData.defendantName} believes that they’ve paid the claim in full.`)
      // check status
      I.click(testData.claimRef)
      I.see(testData.claimRef)
      I.see('Claim status')
      I.see('The defendant’s response')
      I.see(`${testData.defendantName} believes that they’ve paid the claim in full.`)
      I.click('Sign out')
    })
}
