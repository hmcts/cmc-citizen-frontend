import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'

export enum AgeGroupType {
  UNDER_18 = 'UNDER_18',
  BETWEEN_18_AND_25 = 'BETWEEN_18_AND_25',
  OVER_25 = 'OVER_25'
}

export interface Partner {
  ageGroupType: AgeGroupType
  disability: DisabilityStatus
  pensioner: boolean
}
