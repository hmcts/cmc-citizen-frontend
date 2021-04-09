import I = CodeceptJS.I

const I: I = actor()

const fields = {
  typeSubmission: 'input[id=typesubmission]',
  optionYes: 'input[id=declaredyes]',
  optionNo: 'input[id=declaredno]',
  hwfText: 'input[id=helpWithFeesNumber]'
}
const buttons = {
  submit: 'input[type=submit]'
}

export class HwfSteps {

  complete (): void {
    I.see('Do you have a Help With Fees reference number?')
    I.checkOption(fields.optionYes)
    I.fillField(fields.hwfText, 'HWF1234567')
    I.click(buttons.submit)
  }
  noHWF (): void {
    I.see('Do you have a Help With Fees reference number?')
    I.checkOption(fields.optionNo)
    I.click(buttons.submit)
  }
}
