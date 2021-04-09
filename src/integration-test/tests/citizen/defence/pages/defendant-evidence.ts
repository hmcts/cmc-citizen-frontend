import I = CodeceptJS.I

const I: I = actor()

const fields = {
  type: { css: 'select[name="rows[0][type]"]' },
  description: { css: 'textarea[name="rows[0][description]"]' },
  comment: '#comment'
}

const buttons = {
  submit: 'saveAndContinue'
}

export class DefendantEvidencePage {

  enterEvidenceRow (type: string, description: string, comment: string): void {
    I.waitForElement(fields.type)
    I.waitIfOnSafari()
    I.selectOption(fields.type, type)
    I.waitForVisible(fields.description)
    I.fillField(fields.description, description)
    I.fillField(fields.comment, comment)

    I.click(buttons.submit)
  }
}
