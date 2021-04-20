import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

const fields = {
  mediationPhoneNumber: { css: 'input[id="mediationPhoneNumber"]' },
  mediationContactPerson: { css: 'input[id="mediationContactPerson"]' }
}

export class CanWeUseCompanyPage {

  chooseYes (): void {
    I.waitForText('Yes')
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (mediationPhoneNumber: string, mediationContactPerson: string): void {
    I.waitForText('No')
    I.checkOption('No')
    I.fillField(fields.mediationPhoneNumber, mediationPhoneNumber)
    I.fillField(fields.mediationContactPerson, mediationContactPerson)
    I.click(buttons.submit)
  }
}
