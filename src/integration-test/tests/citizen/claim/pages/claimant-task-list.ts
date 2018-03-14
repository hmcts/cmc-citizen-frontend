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

  selectTaskCheckAndSubmitYourClaim (): void {
    I.click('Check and submit your claim')
  }
}
