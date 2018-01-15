import { Moment } from 'moment'

export interface HowMuchPaid {
  amount: number
  pastDate: Moment
  explanation: string
}
