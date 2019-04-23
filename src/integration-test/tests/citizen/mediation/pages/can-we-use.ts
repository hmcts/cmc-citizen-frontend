import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

const fields = {
  mediationPhoneNumber: 'input[id="mediationPhoneNumber"]'
}

export class CanWeUsePage {

  chooseYes (): void {
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (mediationPhoneNumber: string): void {
    I.checkOption('No')
    I.fillField(fields.mediationPhoneNumber, mediationPhoneNumber)
    I.click(buttons.submit)
  }
}
