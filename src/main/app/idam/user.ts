import DraftClaim from 'app/drafts/models/draftClaim'
import Claim from 'app/claims/models/claim'
import { ResponseDraft } from 'response/draft/responseDraft'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { OfferDraft } from 'response/draft/offerDraft'

export default class User {
  id: number
  email: string
  forename: string
  surname: string
  roles: string[]
  group: string
  bearerToken: string
  claimDraft: DraftClaim
  offerDraft: OfferDraft
  claim: Claim
  responseDraft: ResponseDraft
  ccjDraft: DraftCCJ

  constructor (id: number,
               email: string,
               forename: string,
               surname: string,
               roles: string[],
               group: string,
               bearerToken: string) {
    this.id = id
    this.email = email
    this.forename = forename
    this.surname = surname
    this.roles = roles
    this.group = group
    this.bearerToken = bearerToken
  }

  isInRoles (...requiredRoles: string[]): boolean {
    return requiredRoles.every(requiredRole => this.roles.indexOf(requiredRole) > -1)
  }

}
