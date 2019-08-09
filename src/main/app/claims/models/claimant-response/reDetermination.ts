import { MadeBy } from 'claims/models/madeBy'

export interface ReDetermination {
  explanation?: string
  partyType: MadeBy
}

export namespace ReDetermination {
  export function deserialize (input: any): ReDetermination {
    if (!input) {
      return input
    }

    return {
      explanation: input.explanation,
      partyType: MadeBy.valueOf(input.partyType)
    }
  }
}
