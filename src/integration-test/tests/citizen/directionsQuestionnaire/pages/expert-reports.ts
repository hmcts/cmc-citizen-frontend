import I = CodeceptJS.I
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const fields = {
  expertName: 'input[id="rows[0][expertName]"]',
  day: 'input[id="rows[0][reportDate][day]"]',
  month: 'input[id="rows[0][reportDate][month]"]',
  year: 'input[id="rows[0][reportDate][year]"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class ExpertReportsPage {

  chooseYes (expertName: string, reportDate: string): void {
    const [ year, month, day ] = DateParser.parse(reportDate)

    I.checkOption('Yes')
    I.fillField(fields.expertName, expertName)
    I.fillField(fields.day, day)
    I.fillField(fields.month, month)
    I.fillField(fields.year, year)
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
