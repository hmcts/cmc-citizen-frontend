import { listHearingKeywords } from './listHearingKeywords'

export class KeywordHearingEventUtils {
  static getKeywordHearingEvent (amount: number) {
    let keyword: string = ''

    if (amount >= 0.01 && amount <= 300) {
      keyword = listHearingKeywords[0]
    } else if (amount >= 300.01 && amount <= 500) {
      keyword = listHearingKeywords[1]
    } else if (amount >= 500.01 && amount <= 1000) {
      keyword = listHearingKeywords[2]
    } else if (amount >= 1000.01 && amount <= 1500) {
      keyword = listHearingKeywords[3]
    } else if (amount >= 1500.01 && amount <= 3000) {
      keyword = listHearingKeywords[4]
    } else if (amount >= 3000.01 && amount <= 10000) {
      keyword = listHearingKeywords[5]
    } else throw new Error('Amount not allowed')

    return keyword
  }
}
