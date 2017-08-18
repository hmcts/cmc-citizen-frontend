import * as path from 'path'

import Claim from 'claims/models/claim'
import { PartyDetailsMapper } from 'app/pdf/mappers/partyDetailsMapper'
import { PersonalDetailsMapper } from 'app/pdf/mappers/personalDetailsMapper'
import { ClaimMapper } from 'app/pdf/mappers/claimMapper'
import { Person } from 'app/claims/models/person'
import { Party } from 'claims/models/details/yours/party'

const issueTemplatePath = path.join(__dirname, '..', '..', 'resources', 'pdf', 'issueReceipt.njk')

export default class IssueReceipt {

  constructor (public claim: Claim) {
  }

  static get templatePath (): string {
    return issueTemplatePath
  }

  data (): object {
    return {
      claim: ClaimMapper.createClaimDetails(this.claim),
      claimant: PartyDetailsMapper.createPartyDetails(
        this.claim.claimData.claimant as Party,
        this.claim.claimantEmail
      ),
      defendant: PersonalDetailsMapper.createPersonalDetails(
        this.claim.claimData.defendant as Person,
        this.claim.claimData.defendant.email
      )
    }
  }
}
