export enum EvidenceType {
  CONTRACTS_AND_AGREEMENTS = 'CONTRACTS_AND_AGREEMENTS',
  EXPERT_WITNESS = 'EXPERT_WITNESS',
  CORRESPONDENCE = 'CORRESPONDENCE',
  PHOTO = 'PHOTO',
  RECEIPTS = 'RECEIPTS',
  STATEMENT_OF_ACCOUNT = 'STATEMENT_OF_ACCOUNT',
  OTHER = 'OTHER'
}

export interface EvidenceItem {
  type: EvidenceType,
  description: string
}

export type Evidence = ReadonlyArray<EvidenceItem>
