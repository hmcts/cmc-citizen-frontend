import I = CodeceptJS.I
import { ClaimantClaimAmountPage } from 'integration-test/tests/citizen/claim/pages/claimant-claim-amount'
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
import { InterestSteps } from 'integration-test/tests/citizen/claim/steps/interest'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const userSteps: UserSteps = new UserSteps()
const claimSteps: ClaimSteps = new ClaimSteps()
const interestSteps: InterestSteps = new InterestSteps()
const claimantClaimAmountPage: ClaimantClaimAmountPage = new ClaimantClaimAmountPage()

Feature('Claimant enter details of claim: fees')

Scenario('I can see the Claim amount page calculates properly and shows the correct fees table @citizen', async (I: I) => {
  const email: string = await I.createCitizenUser()
  userSteps.login(email)

  claimSteps.completeEligibility()
  claimSteps.optIntoNewFeatures()
  userSteps.selectClaimAmount()
  I.see('Claim amount')
  claimantClaimAmountPage.enterAmount(11, 20.50, 32.25)
  I.see('£63.75')
  I.click('Save and continue')
  I.see('Do you want to claim interest?')
  interestSteps.skipClaimInterest()
  I.see('Total amount you’re claiming')
  I.click('summary')
  I.see('Claim amount Claim fee Hearing fee')
  I.see('£0.01 to £300 £25 £25')
  I.see('£300.01 to £500 £35 £55')
  I.see('£500.01 to £1,000 £60 £80')
  I.see('£1,000.01 to £1,500 £70 £115')
  I.see('£1,500.01 to £3,000 £105 £170')
  I.see('£3,000.01 to £5,000 £185 £335')
  I.see('£5,000.01 to £10,000 £410 £335')
}).retry(3)
