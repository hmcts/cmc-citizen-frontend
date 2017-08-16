import * as path from 'path'

import { MomentFormatter } from 'utils/momentFormatter'
import { DefendantResponse } from 'claims/models/defendantResponse'
import { PersonalDetailsMapper } from 'app/pdf/mappers/personalDetailsMapper'
import { ClaimMapper } from 'app/pdf/mappers/claimMapper'
import Claim from 'claims/models/claim'
import { DefendantMapper } from 'app/pdf/mappers/defendantMapper'
import { Person } from 'app/claims/models/person'
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
      claimant: PersonalDetailsMapper.createPersonalDetails(
        this.claim.claimData.claimant as Person,
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
