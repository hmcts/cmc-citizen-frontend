import I = CodeceptJS.I

const I: I = actor()

const fields = {
  date: 'input[id="rows[x][date]"]',
  description: 'textarea[id="rows[y][description]"]'
}

export class DefendantTimelineEventsPage {

  enterTimelineEvent (eventNum: number, date: string, description: string): void {
    const fieldDate: string = fields.date.replace('x', eventNum.toString())
    const fieldDescription: string = fields.description.replace('y', eventNum.toString())
    I.fillField(fieldDate, date)
    I.fillField(fieldDescription, description)
  }

  submitForm (): void {
    I.click('Save and continue')
  }
}
