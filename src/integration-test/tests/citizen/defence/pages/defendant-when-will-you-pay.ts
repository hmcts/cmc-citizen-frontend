import I = CodeceptJS.I

const I: I = actor()

const fields = {
  paymentOption: {
    Instalments: 'input[id=optionINSTALMENTS]',
    FullBySetDate: 'input[id=optionFULL_BY_SPECIFIED_DATE]'
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantWhenWillYouPayPage {

  chooseInstalments (): void {
    I.checkOption(fields.paymentOption.Instalments)
    I.click(buttons.submit)
  }

  chooseFullBySetDate (): void {
    I.checkOption(fields.paymentOption.FullBySetDate)
    I.click(buttons.submit)
  }

}
