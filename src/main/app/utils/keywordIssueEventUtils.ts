import { listIssueKeywords } from './listIssueKeywords'

//If amount is blank, null or undefined then assign unspecified keyword

export class KeywordIssueEventUtils {
  static getKeywordIssueEvent (amount: number) {
    let keyword: string = ''

    if (amount >= 0.01 && amount <= 300) {
      keyword = listIssueKeywords[0]
    } else if (amount >= 300.01 && amount <= 500) {
      keyword = listIssueKeywords[1]
    } else if (amount >= 500.01 && amount <= 1000) {
      keyword = listIssueKeywords[2]
    } else if (amount >= 1000.01 && amount <= 1500) {
      keyword = listIssueKeywords[3]
    } else if (amount >= 1500.01 && amount <= 3000) {
      keyword = listIssueKeywords[4]
    } else if (amount >= 3000.01 && amount <= 5000) {
      keyword = listIssueKeywords[5]
    } else if (amount >= 5000.01 && amount <= 10000) {
      keyword = listIssueKeywords[6]
    } else if (amount >= 10000.01 && amount <= 200000) {
      keyword = listIssueKeywords[7]
    } else if (amount >= 200000.01) {
      keyword = listIssueKeywords[8]
    } else if (amount == null) {
      keyword = listIssueKeywords[9]
    } else throw new Error('Amount not allowed')

    return keyword
  }
}
