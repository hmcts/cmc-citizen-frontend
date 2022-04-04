import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submitExportNo: { css: 'input[id="expertNo"]' },
  submitExpertYes: { css: 'input[id="expertYes"]' }
}

export class UsingExpertPage {
  chooseExpertNo (): void {
    I.click(buttons.submitExportNo)
  }

  chooseExpertYes (): void {
    I.click(buttons.submitExpertYes)
  }
}
