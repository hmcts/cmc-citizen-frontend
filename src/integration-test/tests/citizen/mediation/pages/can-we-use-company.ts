import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

const fields = {
  mediationPhoneNumber: 'input[id="mediationPhoneNumber"]',
  mediationContactPerson: 'input[id="mediationContactPerson"]'
}

export class CanWeUseCompanyPage {

  chooseYes (): void {
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (mediationPhoneNumber: string, mediationContactPerson: string): void {
    I.checkOption('No')
    I.fillField(fields.mediationPhoneNumber, mediationPhoneNumber)
    I.fillField(fields.mediationContactPerson, mediationContactPerson)
    I.click(buttons.submit)
  }
}
