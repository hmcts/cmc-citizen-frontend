import { MadeBy } from 'claims/models/madeBy'
import { Claim } from 'main/app/claims/models/claim'
import { User } from 'main/app/idam/user'

export function getPreferredParty (claim: Claim): MadeBy {
  const isDefendantBusiness: boolean = claim.claimData.defendant.isBusiness()
  if (isDefendantBusiness) {
    return MadeBy.CLAIMANT
  } else {
    return MadeBy.DEFENDANT
  }
}

export function getUsersRole (claim: Claim, user: User): MadeBy {
  if (claim.claimantId === user.id && claim.response !== undefined) {
    return MadeBy.CLAIMANT
  } else if (claim.defendantId === user.id && claim.response === undefined) {
    return MadeBy.DEFENDANT
  } else {
    throw Error('User has no role in claim')
  }
}
