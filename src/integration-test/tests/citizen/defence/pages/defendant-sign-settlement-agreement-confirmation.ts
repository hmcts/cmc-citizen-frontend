import I = CodeceptJS.I

const I: I = actor()

export class DefendantSignSettlementAgreementConfirmation {

  verifyAcceptanceConfirmation (): void {
    I.see('You’ve both signed a settlement agreement')
  }

  verifyRejectionConfirmation (): void {
    I.see('You’ve rejected the settlement agreement')
  }
}
