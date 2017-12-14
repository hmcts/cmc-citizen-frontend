import { Claim } from 'app/claims/models/claim'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'

export class User {
  id: string
  email: string
  forename: string
  surname: string
  roles: string[]
  group: string
  bearerToken: string
  claim: Claim
  ccjDraft: Draft<DraftCCJ>

  constructor (id: string,
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
