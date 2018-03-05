import I = CodeceptJS.I

const I: I = actor()

const fields = {
  text: 'textarea[id="text"]'
}

export class DefendantImpactOfDisputePage {

  enterImpactOfDispute (text: string): void {
    I.fillField(fields.text, text)
  }

  submitForm (): void {
    I.click('Save and continue')
  }

}
