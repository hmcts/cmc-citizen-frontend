import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submitExportNo: 'input[id="expertNo"]',
  submitExpertYes: 'input[id="expertYes"]'
}

export class UsingExpertPage {
  chooseExpertNo (): void {
    I.click(buttons.submitExportNo)
  }

  chooseExpertYes (): void {
    I.click(buttons.submitExpertYes)
  }
}
