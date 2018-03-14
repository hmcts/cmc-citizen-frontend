import I = CodeceptJS.I

const I: I = actor()

export class AccessRoutesSteps {
  returnToClaimMcol (): void {
    I.amOnPage('/return-to-claim')
    I.fillField('asdasdas')
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
