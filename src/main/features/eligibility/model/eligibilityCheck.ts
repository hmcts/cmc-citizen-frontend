export interface EligibilityCheck {
  eligible: boolean
  notEligibleReason?: string
}

export function eligible (): EligibilityCheck {
  return {
    eligible: true
  }
}

export function notEligible (reason: string): EligibilityCheck {
  return {
    eligible: false,
    notEligibleReason: reason
  }
}
