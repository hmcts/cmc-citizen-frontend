import * as path from 'path'

import { MomentFormatter } from 'utils/momentFormatter'
import { DefendantResponse } from 'claims/models/defendantResponse'
import { PartyDetailsMapper } from 'app/pdf/mappers/partyDetailsMapper'
import { ClaimMapper } from 'app/pdf/mappers/claimMapper'
import Claim from 'claims/models/claim'
import { DefendantMapper } from 'app/pdf/mappers/defendantMapper'
import Party from 'app/claims/models/party'
import { Defendant } from 'app/claims/models/defendant'

const responseTemplatePath = path.join(__dirname, '..', '..', 'resources', 'pdf', 'responseReceipt.njk')

export class ResponseReceipt {

  constructor (public claim: Claim, public defendantResponse: DefendantResponse, public responseDashboardUrl: string) {
  }

  static get templatePath (): string {
    return responseTemplatePath
  }

  data (): object {
    return {
      claim: ClaimMapper.createClaimDetails(this.claim),
      defence: {
        respondedAt: MomentFormatter.formatLongDateAndTime(this.defendantResponse.respondedAt),
        response: this.defendantResponse.response.defence,
        freeMediation: this.defendantResponse.response.freeMediation
      },
      claimant: PartyDetailsMapper.createPersonalDetails(
        this.claim.claimData.claimant as Party,
        this.claim.claimantEmail
      ),
      defendant: DefendantMapper.createDefendantDetails(
        this.defendantResponse.defendantDetails as Defendant,
        this.defendantResponse.defendantEmail
      ),
      responseDashboardUrl: this.responseDashboardUrl
    }
  }
}
