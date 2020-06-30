import { Paths } from 'eligibility/paths'
import { RoutablePath } from 'shared/router/routablePath'

export interface EligibilityCheck {
  eligible: boolean
  notEligibleReason?: string
  notEligiblePage?: RoutablePath
}

export function eligible (): EligibilityCheck {
  return {
    eligible: true
  }
}

export function notEligible (reason: string, notEligiblePage: RoutablePath = Paths.notEligiblePage): EligibilityCheck {
  return {
    eligible: false,
    notEligibleReason: reason,
    notEligiblePage: notEligiblePage
  }
}
