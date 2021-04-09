import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { claimAmount } from 'integration-test/data/test-data'
import { AmountHelper } from 'integration-test/helpers/amountHelper'

const I: I = actor()

const fields = {
  checkboxFactsTrue: 'input#signedtrue',
  signerName: 'input[id=signerName]',
  signerRole: 'input[id=signerRole]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class CountyCourtJudgementCheckAndSendPage {

  signStatementOfTruthAndSubmit (signerName: string, signerRole: string): void {
    I.fillField(fields.signerName, signerName)
    I.fillField(fields.signerRole, signerRole)
    this.checkFactsTrueAndSubmit()
  }

  checkFactsTrueAndSubmit (): void {
    I.checkOption(fields.checkboxFactsTrue)
    I.click(buttons.submit)
  }

  checkDefendantName (defendant: Party, defendantType: PartyType): void {
    switch (defendantType) {
      case PartyType.INDIVIDUAL:
        I.see(defendant.title)
        I.see(defendant.firstName)
        I.see(defendant.lastName)
        break
      case PartyType.SOLE_TRADER:
        I.see(defendant.firstName)
        I.see(defendant.lastName)
        break
      case PartyType.COMPANY:
        I.see(defendant.name)
        break
      case PartyType.ORGANISATION:
        I.see(defendant.name)
        break
      default:
        throw new Error('non-matching defendant type in check-and-send')
    }
  }

  verifyCheckAndSendAnswers (defendant: Party, defendantType: PartyType, defendantPaidAmount: number, address): void {
    I.see('Check your answers')
    this.checkDefendantName(defendant, defendantType)
    I.see(address.line1)
    I.see(address.line2)
    I.see(address.city)
    I.see(address.postcode)
    I.see('Total to be paid by defendant')
    const amountOutstanding: number = claimAmount.getTotal() - defendantPaidAmount
    I.see(AmountHelper.formatMoney(amountOutstanding))
    I.see('Amount already paid')
    I.see(AmountHelper.formatMoney(defendantPaidAmount))
  }

  verifyCheckAndSendPageAnswers (defendant: Party, defendantType: PartyType, defendantPaidAmount: number, address): void {
    I.see('Check your answers')
    this.checkDefendantName(defendant, defendantType)
    I.see(address.line1)
    I.see(address.line2)
    I.see(address.city)
    I.see(address.postcode)
    I.see('Total to be paid by defendant')
    I.see('How you want the defendant to pay')
  }
}
