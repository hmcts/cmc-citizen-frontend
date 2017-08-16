import { MomentFactory } from 'common/momentFactory'

export function isAfter4pm (): boolean {
  return MomentFactory.currentDateTime().hour() > 15
}
