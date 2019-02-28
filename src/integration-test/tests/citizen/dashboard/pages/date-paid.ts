import I = CodeceptJS.I
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const fields = {
  day: 'input[id="date[day]"]',
  month: 'input[id="date[month]"]',
  year: 'input[id="date[year]"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DatePaidPage {

  datePaid (datePaid: string): void {
    const [ year, month, day ] = DateParser.parse(datePaid)

    I.see('When did you settle the claim?')
    I.fillField(fields.day, day)
    I.fillField(fields.month, month)
    I.fillField(fields.year, year)
    I.click(buttons.submit)
  }
}
