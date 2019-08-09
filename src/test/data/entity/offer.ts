import { MadeBy } from 'claims/models/madeBy'
import { StatementType } from 'offer/form/models/statementType'

export const offer = {
  type: StatementType.OFFER.value,
  madeBy: MadeBy.DEFENDANT.value,
  offer: {
    content: 'Offer',
    completionDate: '2018-01-01'
  }
}

export const offerRejection = {
  type: StatementType.REJECTION.value,
  madeBy: MadeBy.DEFENDANT.value
}
