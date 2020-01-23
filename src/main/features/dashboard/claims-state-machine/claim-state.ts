import { initialTransitions } from 'dashboard/claims-state-machine/initial-transitions'
import { fullDefenceTransitions } from 'dashboard/claims-state-machine/full-defence-transitions'
import { Claim } from 'claims/models/claim'
import { FullDefenceStates } from 'claims/models/claim-states/full-defence-states'

export function claimState (claims: Claim[], type: string): void {
  claims.forEach(function (eachClaim) {
    let claimantState = initialTransitions(eachClaim)
    claimantState.findState(claimantState)

    if (claimantState.is(FullDefenceStates.FULL_DEFENCE)) {
      claimantState = fullDefenceTransitions(eachClaim)
      claimantState.findState(claimantState)
    }

    eachClaim.template = claimantState.getTemplate(type)
  })
}
