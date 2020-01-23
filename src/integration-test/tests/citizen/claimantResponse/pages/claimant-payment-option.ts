import I = CodeceptJS.I

const I: I = actor()

const fields = {
  paymentOption: {
    Immediately: 'input[id=optionIMMEDIATELY]',
    Instalments: 'input[id=optionINSTALMENTS]',
    BySetDate: 'input[id=optionBY_SPECIFIED_DATE]'
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantPaymentOptionPage {

  chooseImmediately (): void {
    I.checkOption(fields.paymentOption.Immediately)
    I.click(buttons.submit)
  }

  chooseInstalments (): void {
    I.checkOption(fields.paymentOption.Instalments)
    I.click(buttons.submit)
  }

  chooseFullBySetDate (): void {
    I.checkOption(fields.paymentOption.BySetDate)
    I.click(buttons.submit)
  }

}
