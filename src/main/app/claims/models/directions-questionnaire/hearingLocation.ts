import { Address } from 'claims/models/address'

export enum CourtLocationType {
  SUGGESTED_COURT = 'SUGGESTED_COURT',
  ALTERNATE_COURT = 'ALTERNATE_COURT'
}

export interface HearingLocation {
  courtName?: string,
  courtAddress?: Address,
  hearingLocationSlug?: string,
  locationOption?: CourtLocationType,
  exceptionalCircumstancesReason?: string
}
