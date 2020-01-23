import I = CodeceptJS.I
import { LoginPage } from 'integration-test/tests/citizen/home/pages/login'
import { DEFAULT_PASSWORD } from 'integration-test/data/test-data'

const I: I = actor()
const returnToClaimPage = '/return-to-claim'
const respondToClaimPage = '/respond-to-claim'

const selectors = {
  reference: 'input[id=reference]',
  noClaimNumberLink: 'Don’t have a claim number?',
  submit: 'input[type=submit]',
  mcolRadio: 'input[id="service-mcol"]',
  moneyclaimsRadio: 'input[id="service-moneyclaims"]'
}

const ccbcReference = 'A1QZ1234'
const mcolText = 'Money Claim Online'
const dashboardHeading = 'Your money claims account'

const loginPage = new LoginPage()

export class AccessRoutesSteps {
  returnToClaimMcol (): void {
    I.amOnPage(returnToClaimPage)
    I.fillField(selectors.reference, ccbcReference)
    I.click(selectors.submit)
    I.see(mcolText)
  }

  returnToClaimMoneyClaims (reference: string, username: string): void {
    I.amOnPage(returnToClaimPage)
    I.fillField(selectors.reference, reference)
    I.click(selectors.submit)
    loginPage.login(username, DEFAULT_PASSWORD)
    I.see(dashboardHeading)
  }

  dontHaveAReferenceMcol (): void {
    I.amOnPage(returnToClaimPage)
    I.click(selectors.noClaimNumberLink)
    I.checkOption(selectors.mcolRadio)
    I.click(selectors.submit)
    I.see(mcolText)
  }

  dontHaveAReferenceMoneyClaims (username: string): void {
    I.amOnPage(returnToClaimPage)
    I.click(selectors.noClaimNumberLink)
    I.checkOption(selectors.moneyclaimsRadio)
    I.click(selectors.submit)
    loginPage.login(username, DEFAULT_PASSWORD)
    I.see(dashboardHeading)
  }

  respondToClaimMcol (): void {
    I.amOnPage(respondToClaimPage)
    I.fillField(selectors.reference, ccbcReference)
    I.click(selectors.submit)
    I.see(mcolText)
  }

  respondToClaimMoneyClaims (reference: string): void {
    I.amOnPage(respondToClaimPage)
    I.fillField(selectors.reference, reference)
    I.click(selectors.submit)
    I.see('Security code')
  }
}
