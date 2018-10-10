import I = CodeceptJS.I

const I: I = actor()

const fields = {
  checkboxConfirm: 'input[id=signedTrue]',
  submit: 'input[id=saveAndContinue]'
}

export class ClaimantSignSettlementAgreement {

  confirm (): void {
    I.checkOption(fields.checkboxConfirm)
    I.click(fields.submit)
  }

}
