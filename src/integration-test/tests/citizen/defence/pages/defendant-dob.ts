import I = CodeceptJS.I
import { DateParser } from 'integration-tests/utils/date-parser'

const I: I = actor()

const fields = {
  day: 'input[id="date[day]"]',
  month: 'input[id="date[month]"]',
  year: 'input[id="date[year]"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantDobPage {

  enterDOB (dob: string): void {
    const [ year, month, day ] = DateParser.parse(dob)

    I.fillField(fields.day, day)
    I.fillField(fields.month, month)
    I.fillField(fields.year, year)

    I.click(buttons.submit)
  }
}
