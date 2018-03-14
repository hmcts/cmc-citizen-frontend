import I = CodeceptJS.I
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const fields = {
  offerText: 'textarea[id=offerText]',
  completionOfferDate: {
    day: 'input[id=\'completionDate[day]\']',
    month: 'input[id=\'completionDate[month]\']',
    year: 'input[id=\'completionDate[year]\']'
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantOfferPage {

  enterOffer (offerText: string, date: string): void {
    const [ year, month, day ] = DateParser.parse(date)

    I.see('Make an offer')
    I.fillField(fields.offerText, offerText)
    I.fillField(fields.completionOfferDate.day, day)
    I.fillField(fields.completionOfferDate.month, month)
    I.fillField(fields.completionOfferDate.year, year)
    I.click(buttons.submit)
  }
}
