export class EvidenceType {
  static readonly CONTRACTS_AND_AGREEMENTS = new EvidenceType('CONTRACTS_AND_AGREEMENTS', 'Contracts and agreements')
  static readonly EXPERT_WITNESS = new EvidenceType('EXPERT_WITNESS', 'Expert witness')
  static readonly CORRESPONDENCE = new EvidenceType('CORRESPONDENCE', 'Letters, emails and other correspondence')
  static readonly PHOTO = new EvidenceType('PHOTO', 'Photo evidence')
  static readonly RECEIPTS = new EvidenceType('RECEIPTS', 'Receipts')
  static readonly STATEMENT_OF_ACCOUNT = new EvidenceType('STATEMENT_OF_ACCOUNT', 'Statements of account')
  static readonly OTHER = new EvidenceType('OTHER', 'Other')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static valueOf (value: string): EvidenceType {
    return EvidenceType.all().filter(type => type.value === value).pop()
  }

  static all (): EvidenceType[] {
    return [
      EvidenceType.CONTRACTS_AND_AGREEMENTS,
      EvidenceType.EXPERT_WITNESS,
      EvidenceType.CORRESPONDENCE,
      EvidenceType.PHOTO,
      EvidenceType.RECEIPTS,
      EvidenceType.STATEMENT_OF_ACCOUNT,
      EvidenceType.OTHER
    ]
  }
}
