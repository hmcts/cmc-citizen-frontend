import { initialTransitions } from 'dashboard/claims-state-machine/initial-transitions'
import { fullDefenceTransitions } from 'dashboard/claims-state-machine/full-defence-transitions'
import { fullAdmissionTransitions } from 'dashboard/claims-state-machine/full-admission-transitions'
import { partAdmissionTransitions } from 'dashboard/claims-state-machine/part-admission-transitions'
import { Claim } from 'claims/models/claim'
import { FullDefenceStates } from 'claims/models/claim-states/full-defence-states'
import { FullAdmissionStates } from 'claims/models/claim-states/full-admission-states'
import { PartAdmissionStates } from 'claims/models/claim-states/part-admission-states'

export function claimState (claims: Claim[], type: string): void {
  claims.forEach(function (eachClaim) {
    let claimantState = initialTransitions(eachClaim)
    claimantState.findState(claimantState)

    if (claimantState.is(FullDefenceStates.FULL_DEFENCE)) {
      claimantState = fullDefenceTransitions(eachClaim)
      claimantState.findState(claimantState)
    } else if (claimantState.is(FullAdmissionStates.FULL_ADMISSION)) {
      claimantState = fullAdmissionTransitions(eachClaim)
      claimantState.findState(claimantState)
    } else if (claimantState.is(PartAdmissionStates.PART_ADMISSION)) {
      claimantState = partAdmissionTransitions(eachClaim)
      claimantState.findState(claimantState)
    }

    eachClaim.template = claimantState.getTemplate(type)
  })
}
