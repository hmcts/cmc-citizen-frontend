import I = CodeceptJS.I

const I: I = actor()

const fields = {
  checkboxYes: 'input[id=optionyes]',
  checkboxNo: 'input[id=optionno]'
}

const buttons = {
  saveAndContinue: 'input[id=saveAndContinue]'
}

export class DefendantSignSettlementAgreement {

  confirm (): void {
    I.checkOption(fields.checkboxYes)
    I.click(buttons.saveAndContinue)
  }

  reject (): void {
    I.checkOption(fields.checkboxNo)
    I.click(buttons.saveAndContinue)
  }

}
