import I = CodeceptJS.I

const I: I = actor()

export class ClaimantTaskListPage {

  open (): void {
    I.amOnCitizenAppPage('/claim/task-list')
  }

  selectTaskResolvingThisDispute (): void {
    I.click('Resolving this dispute')
  }

  selectTaskCompletingYourClaim (): void {
    I.click('Completing your claim')
  }

  selectTaskYourDetails (): void {
    I.click('Your details')
  }

  selectTaskTheirDetails (): void {
    I.click('Their details')
  }

  selectTaskClaimAmount (): void {
    I.click('Claim amount')
  }

  selectTaskClaimDetails (): void {
    I.click('Claim details')
  }

  async selectTaskCheckAndSubmitYourClaim () {
    try {
      await I.click('Check and submit your claim')
      return true
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error('Error occurred during: Click and submit your claim', error)
      return false
    }
  }
}
