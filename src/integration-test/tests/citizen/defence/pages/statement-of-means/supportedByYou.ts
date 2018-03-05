import I = CodeceptJS.I

const I: I = actor()

const fields = {
  dontSupportAnyone: 'input[id="doYouSupportAnyonefalse"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class SupportedByYouPage {

  selectDontSupportAnyone (): void {
    I.checkOption(fields.dontSupportAnyone)
    I.click(buttons.submit)
  }
}
