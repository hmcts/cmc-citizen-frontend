import { expect } from 'chai'

import { KeywordIssueEventUtils } from "utils/keywordIssueEventUtils";

describe("KeywordIssueEventUtils", () => {

  it('should return correct keyword based on amount when given lower limits', () => {
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(0.01)).to.eq('PaperClaimUpTo300')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(300.01)).to.eq('PaperClaimUpTo500')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(500.01)).to.eq('PaperClaimUpTo1000')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(1000.01)).to.eq('PaperClaimUpTo1500')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(1500.01)).to.eq('PaperClaimUpTo3k')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(3000.01)).to.eq('PaperClaimUpTo5k')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(5000.01)).to.eq('PaperClaimUpTo10k')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(10000.01)).to.eq('PaperClaimUpTo200k')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(200000.01)).to.eq('PaperClaimAbove200k')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(null)).to.eq('UnspecifiedClaim')
  })

  it('should return correct keyword based on amount when given upper limits, no upper limit for PaperClaimAbove200k and UnspecifiedClaim', () => {
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(300)).to.eq('PaperClaimUpTo300')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(500)).to.eq('PaperClaimUpTo500')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(1000)).to.eq('PaperClaimUpTo1000')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(1500)).to.eq('PaperClaimUpTo1500')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(3000)).to.eq('PaperClaimUpTo3k')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(5000)).to.eq('PaperClaimUpTo5k')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(10000)).to.eq('PaperClaimUpTo10k')
    expect(KeywordIssueEventUtils.getKeywordIssueEvent(200000)).to.eq('PaperClaimUpTo200k')
  })
})
