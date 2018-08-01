import I = CodeceptJS.I

const I: I = actor()

const fields = {
  yes: 'input[id=optionyes]',
  no: 'input[id=optionno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantHaveYouPaidTheClaimantTheAmountYouAdmitYouOwePage {

  selectYesOption (): void {
    I.checkOption(fields.yes)
    I.click(buttons.submit)
  }

  selectNoOption (): void {
    I.checkOption(fields.no)
    I.click(buttons.submit)
  }
}
