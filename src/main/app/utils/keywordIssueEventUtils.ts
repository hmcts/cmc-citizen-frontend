import { listIssueKeywords } from 'listIssueKeywords';

export class KeywordIssueEventUtils {
  static getKeywordIssueEvent (amount: number) {
    let keyword: String = '';

    if (amount >= 0.01 && amount <= 300) {
      keyword = listIssueKeywords[0];
    } else if (amount >= 300.01 && amount <= 500) {
      keyword = listIssueKeywords[0];
    } else if (amount >= 500.01 && amount <= 1000) {
      keyword = listIssueKeywords[0];
    } else if (amount >= 1000.01 && amount <= 1500) {
      keyword = listIssueKeywords[0];
    } else if (amount >= 1500.01 && amount <= 3000) {
      keyword = listIssueKeywords[0];
    } else if (amount >= 3000.01 && amount <= 5000) {
      keyword = listIssueKeywords[0];
    } else if (amount >= 5000.01 && amount <= 10000) {
      keyword = listIssueKeywords[0];
    } else if (amount >= 10000.01 && amount <= 200000) {
      keyword = listIssueKeywords[0];
    } else if (amount >= 200000.01) {
      keyword = listIssueKeywords[0];
    } else keyword = listIssueKeywords[0];

    return keyword
  }
}
