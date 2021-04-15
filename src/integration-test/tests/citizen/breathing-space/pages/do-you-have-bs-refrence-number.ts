import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

const fields = {
  bsReferenceNumber: { css: 'input[id="bsNumber"]' }
}

export class DoYouHaveBsReferenceNumberPage {

  enterReferenceNumber (ref: string): void {
    I.fillField(fields.bsReferenceNumber,ref)
    I.click(buttons.submit)
  }
}
