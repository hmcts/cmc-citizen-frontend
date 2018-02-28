import { individual } from './party'
import { whenDidYouPay } from './whenDidYouPay'

export const responseData = {
  defendant: individual,
  moreTimeNeeded: 'no',
  responseType: 'FULL_DEFENCE',
  defenceType: 'DISPUTE',
  defence: 'My defence',
  freeMediation: 'no',
  whenDidYouPay: whenDidYouPay
}
