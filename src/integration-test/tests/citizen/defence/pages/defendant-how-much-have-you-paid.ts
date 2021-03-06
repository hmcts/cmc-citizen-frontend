import I = CodeceptJS.I
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const fields = {
  amount: 'input[id=amount]',
  day: 'input[id="date[day]"]',
  month: 'input[id="date[month]"]',
  year: 'input[id="date[year]"]',
  text: 'textarea[id=text]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantHowMuchHaveYouPaidPage {

  enterAmountPaidWithDateAndExplanation (amount: number, date: string, explanation: string): void {
    const [year, month, day] = DateParser.parse(date)
    I.fillField(fields.amount, amount.toString())
    I.fillField(fields.day, day)
    I.fillField(fields.month, month)
    I.fillField(fields.year, year)
    I.fillField(fields.text, explanation)
    I.click(buttons.submit)
  }

  continue (): void {
    I.click('Save and continue')
  }
}
