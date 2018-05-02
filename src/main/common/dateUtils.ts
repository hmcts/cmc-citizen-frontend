import { MomentFactory } from 'shared/momentFactory'

export function isAfter4pm (): boolean {
  return MomentFactory.currentDateTime().hour() > 15
}
