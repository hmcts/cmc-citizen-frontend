import I = CodeceptJS.I

const I: I = actor()

const fields = {
  disabledAccess: {
    input: { css: 'input[id="disabledAccessSelectedtrue"]' }
  },
  hearingLoop: {
    input: { css: 'input[id="hearingLoopSelectedtrue"]' }
  },
  signLanguageInterpreter: {
    input: { css: 'input[id="signLanguageSelectedtrue"]' },
    details: { css: 'input[id="signLanguageInterpreted"]' }
  },
  languageInterpreter: {
    input: { css: 'input[id="languageSelectedtrue"]' },
    details: { css: 'input[id="languageInterpreted"]' }
  },
  otherSupport: {
    input: { css: 'input[id="otherSupportSelectedtrue"]' },
    details: { css: 'textarea[id="otherSupport"]' }
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class SupportRequiredPage {
  selectAll (): void {
    const someText: string = 'Some Text'
    I.checkOption(fields.disabledAccess.input)
    I.checkOption(fields.hearingLoop.input)
    I.checkOption(fields.signLanguageInterpreter.input)
    I.fillField(fields.signLanguageInterpreter.details, someText)
    I.checkOption(fields.languageInterpreter.input)
    I.fillField(fields.languageInterpreter.details, someText)
    I.checkOption(fields.otherSupport.input)
    I.fillField(fields.otherSupport.details, someText)
    I.click(buttons.submit)
  }
}
