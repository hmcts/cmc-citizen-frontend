import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class BreathingSpace {
  breathingSpaceEnteredDate?: Moment
  breathingSpaceEnteredbyInsolvencyTeamDate?: Moment
  breathingSpaceEndDate?: Moment
  breathingSpaceLiftedDate?: Moment
  breathingSpaceLiftedbyInsolvencyTeamDate?: Moment
  breathingSpaceReferenceNumber?: string
  breathingSpaceLiftedFlag?: string
  breathingSpaceType?: string
  breathingSpaceExternalId?: string

  deserialize (input?: any): BreathingSpace {
    if (input) {
      if (input.bs_entered_date) {
        this.breathingSpaceEnteredDate = MomentFactory.parse(input.bs_entered_date)
      }
      if (input.bs_entered_date_by_insolvency_team) {
        this.breathingSpaceEnteredbyInsolvencyTeamDate = MomentFactory.parse(input.bs_entered_date_by_insolvency_team)
      }
      if (input.bs_expected_end_date) {
        this.breathingSpaceEndDate = MomentFactory.parse(input.bs_expected_end_date)
      }
      if (input.bs_lifted_date) {
        this.breathingSpaceLiftedDate = MomentFactory.parse(input.bs_lifted_date)
      }
      if (input.bs_lifted_date_by_insolvency_team) {
        this.breathingSpaceLiftedbyInsolvencyTeamDate = MomentFactory.parse(input.bs_lifted_date_by_insolvency_team)
      }
      if (input.bs_reference_number) {
        this.breathingSpaceReferenceNumber = input.bs_reference_number
      }
      if (input.bs_lifted_flag) {
        this.breathingSpaceLiftedFlag = input.bs_lifted_flag
      }
      if (input.bs_type) {
        this.breathingSpaceType = input.bs_type
      }
      if (input.externalId) {
        this.breathingSpaceExternalId = input.externalId
      }
      return this
    }
  }
}
