import I = CodeceptJS.I
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const heading = {
  text: 'Have you already got a report written by an expert?'
}
const fields = {
  expertName: { css: 'input[id="rows[0][expertName]"]' },
  day: { css: 'input[id="rows[0][reportDate][day]"]' },
  month: { css: 'input[id="rows[0][reportDate][month]"]' },
  year: { css: 'input[id="rows[0][reportDate][year]"]' }
}
const buttons = {
  submit: { css: 'input[id="saveAndContinue"]' }
}

export class ExpertReportsPage {

  chooseYes (expertName: string, reportDate: string): void {
    const [ year, month, day ] = DateParser.parse(reportDate)

    I.waitForText(heading.text)
    I.checkOption('Yes')
    I.waitForVisible(fields.expertName)
    I.fillField(fields.expertName, expertName)
    I.fillField(fields.day, day)
    I.fillField(fields.month, month)
    I.fillField(fields.year, year)
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText(heading.text)
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
