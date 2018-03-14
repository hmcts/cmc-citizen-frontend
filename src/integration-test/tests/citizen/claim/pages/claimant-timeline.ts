import I = CodeceptJS.I

const I: I = actor()

const fields = {
  date: 'rows[0][date]',
  description: 'rows[0][description]'
}

const buttons = {
  submit: 'saveAndContinue'
}

export class ClaimantTimelinePage {

  enterTimelineRow (date: string, description: string): void {
    I.fillField(fields.date, date)
    I.fillField(fields.description, description)

    I.click(buttons.submit)
  }
}
