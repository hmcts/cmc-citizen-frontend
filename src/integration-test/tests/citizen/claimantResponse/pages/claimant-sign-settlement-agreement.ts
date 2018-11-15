import I = CodeceptJS.I

const I: I = actor()

const fields = {
  checkboxConfirm: 'input[id=signedtrue]'
}

const buttons = {
  saveAndContinue: 'input[id=saveAndContinue]'
}

export class ClaimantSignSettlementAgreement {

  confirm (): void {
    I.checkOption(fields.checkboxConfirm)
    I.click(buttons.saveAndContinue)
  }

}
