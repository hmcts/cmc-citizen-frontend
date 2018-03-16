import I = CodeceptJS.I

const I: I = actor()
const returnToClaimPage = '/return-to-claim'

export class AccessRoutesSteps {
  returnToClaimMcol (): void {
    I.amOnPage(returnToClaimPage)
    I.fillField('#reference', 'AA12321321')
  }

  returnToClaimMoneyClaims (reference: string, username: string): void {

  }

  dontHaveAReferenceMcol (): void {

  }

  dontHaveAReferenceMoneyClaims (username: string): void {

  }

  respondToClaimMcol (): void {

  }

  respondToClaimMoneyClaims (referenceNumber: string): void {

  }
}
