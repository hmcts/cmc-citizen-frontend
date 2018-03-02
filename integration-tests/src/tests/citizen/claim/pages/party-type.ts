import I = CodeceptJS.I

const I: I = actor()

const fields = {
  partyType: {
    individual: 'input[id="typeindividual"]',
    soleTrader: 'input[id="typesoleTrader"]',
    company: 'input[id="typecompany"]',
    organisation: 'input[id="typeorganisation"]'

  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class PartyTypePage {

  selectIndividual (): void {
    I.checkOption(fields.partyType.individual)
    I.click(buttons.submit)
  }

  selectSoleTrader (): void {
    I.checkOption(fields.partyType.soleTrader)
    I.click(buttons.submit)
  }

  selectCompany (): void {
    I.checkOption(fields.partyType.company)
    I.click(buttons.submit)
  }

  selectOrganisationl (): void {
    I.checkOption(fields.partyType.organisation)
    I.click(buttons.submit)
  }

}
