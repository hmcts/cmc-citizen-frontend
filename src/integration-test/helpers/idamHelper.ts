/* tslint:disable:no-console */

class IdamHelper extends codecept_helper {

  getClaimantEmail (): string {
    // @ts-ignore
    return this.config.claimantEmail
  }

  getDefendantEmail (): string {
    // @ts-ignore
    return this.config.defendantEmail
  }
}

// Node.js style export is required by CodeceptJS framework
module.exports = IdamHelper
