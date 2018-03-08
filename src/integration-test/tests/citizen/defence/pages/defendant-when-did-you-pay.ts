import I = CodeceptJS.I
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const fields = {
  day: 'input[id="date[day]"]',
  month: 'input[id="date[month]"]',
  year: 'input[id="date[year]"]',
  text: 'textarea[id=text]'
}

export class DefendantWhenDidYouPayPage {

  enterDateAndExplaination (date: string, explaination: string): void {
    const [ year, month, day ] = DateParser.parse(date)

    I.fillField(fields.day, day)
    I.fillField(fields.month, month)
    I.fillField(fields.year, year)
    I.fillField(fields.text, explaination)
  }
}
