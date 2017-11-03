import * as path from 'path'

import { MomentFormatter } from 'utils/momentFormatter'
import { PartyDetailsMapper } from 'app/pdf/mappers/partyDetailsMapper'
import { ClaimMapper } from 'app/pdf/mappers/claimMapper'
import Claim from 'claims/models/claim'
import { DefendantMapper } from 'app/pdf/mappers/defendantMapper'

const responseTemplatePath = path.join(__dirname, '..', '..', 'resources', 'pdf', 'responseReceipt.njk')

export class ResponseReceipt {

  constructor (public claim: Claim, public responseDashboardUrl: string) {
  }

  static get templatePath (): string {
    return responseTemplatePath
  }

  data (): object {
    const data = {
      claim: ClaimMapper.createClaimDetails(this.claim),
      defence: {
        respondedAt: MomentFormatter.formatLongDateAndTime(this.claim.respondedAt),
        response: this.claim.response.defence,
        freeMediation: this.claim.response.freeMediation
      },
      claimant: PartyDetailsMapper.createPartyDetails(
        this.claim.claimData.claimant,
        this.claim.claimantEmail
      ),
      defendant: DefendantMapper.createDefendantDetails(
        this.claim.response.defendantDetails,
        this.claim.defendantEmail
      ),
      responseDashboardUrl: this.responseDashboardUrl
    }

    if (this.claim.response.statementOfTruth) {
      data.defence['statementOfTruth'] = {
        signerName: this.claim.response.statementOfTruth.signerName,
        signerRole: this.claim.response.statementOfTruth.signerRole
      }
    }
    return data
  }
}
