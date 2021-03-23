import { Moment } from "moment"
import { MomentFactory } from "shared/momentFactory"
// import { BreathingSpaceReferenceNumber } from 'features/breathing-space/models/bsReferenceNumber'

export class BreathingSpace {
    breathingSpaceEnteredDate?: Moment
    breathingSpaceEndDate?: Moment
    breathingSpaceReferenceNumber?: string
    breathingSpaceType?: string
    breathingSpaceExternalId?: string

    deserialize(input?: any): BreathingSpace {
        if (input) {
            if (input.bs_entered_date_by_insolvency_team) {
                this.breathingSpaceEnteredDate = MomentFactory.parse(input.bs_entered_date_by_insolvency_team)
            }
            if (input.bs_expected_end_date) {
                this.breathingSpaceEndDate = MomentFactory.parse(input.bs_expected_end_date)
            }
            if (input.bs_reference_number) {
                this.breathingSpaceReferenceNumber = input.bs_reference_number
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
