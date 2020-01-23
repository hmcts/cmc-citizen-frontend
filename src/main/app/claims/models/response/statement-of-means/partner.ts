import { DisabilityStatus } from 'claims/models/response/statement-of-means/disabilityStatus'

export interface Partner {
  over18: boolean
  disability: DisabilityStatus
  pensioner: boolean
}
