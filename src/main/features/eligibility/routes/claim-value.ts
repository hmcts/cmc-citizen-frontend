import * as express from 'express'

import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'

class ClaimValueEligibilityPage extends EligibilityPage<ClaimValue> {
  constructor () {
    super(Paths.eligibilityClaimValuePage, 'claimValue', ValidationGroups.CLAIM_VALUE)
  }

  checkValue (value: ClaimValue, res: express.Response): void {
    switch (value) {
      case ClaimValue.NOT_KNOWN:
        res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_VALUE_NOT_KNOWN}`)
        break
      case ClaimValue.OVER_10000:
        res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIM_VALUE_OVER_10000}`)
        break
      case ClaimValue.UNDER_10000:
        res.redirect(Paths.eligibilityHelpWithFeesPage.uri)
        break
      default:
        throw new Error(`Unexpected claimValue: ${value.option}`)
    }
  }
}

/* tslint:disable:no-default-export */
export default new ClaimValueEligibilityPage().buildRouter()
