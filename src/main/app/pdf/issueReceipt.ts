import * as path from 'path'

import Claim from 'claims/models/claim'
import { PartyDetailsMapper } from 'app/pdf/mappers/partyDetailsMapper'
import { TheirDetailsMapper } from 'app/pdf/mappers/theirDetailsMapper'
import { ClaimMapper } from 'app/pdf/mappers/claimMapper'

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
        this.claim.claimData.claimant,
        this.claim.claimantEmail
      ),
      defendant: TheirDetailsMapper.createTheirDetails(
        this.claim.claimData.defendant,
        this.claim.claimData.defendant.email
      )
    }
  }
}
