import I = CodeceptJS.I
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const fields = {
  day: 'input[id="date[day]"]',
  month: 'input[id="date[month]"]',
  year: 'input[id="date[year]"]',
  claimNumber: 'input[id="claimNumber"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class UpdateResponseDeadlinePage {

  open (): void {
    I.amOnCitizenAppPage('/response/your-dob')
  }

  updateDeadline (claimNumber: string, date: string): void {
    I.fillField(fields.claimNumber, claimNumber)

    const [ year, month, day ] = DateParser.parse(date)
    I.fillField(fields.day, day)
    I.fillField(fields.month, month)
    I.fillField(fields.year, year)

    I.click(buttons.submit)

    I.see('Testing support')
  }
}
