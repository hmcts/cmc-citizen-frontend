import I = CodeceptJS.I
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const fields = {
  day: 'input[id="date[day]"]',
  month: 'input[id="date[month]"]',
  year: 'input[id="date[year]"]',
  reason: 'textarea[id=reason]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestStartDatePage {

  selectParticularDate (date: string, reason: string): void {
    const [ year, month, day ] = DateParser.parse(date)

    I.fillField(fields.day, day)
    I.fillField(fields.month, month)
    I.fillField(fields.year, year)
    I.fillField(fields.reason, 'Because I want to')
    I.click(buttons.submit)
  }
}
