import { ClaimStatusFlow } from 'dashboard/helpers/claimStatusFlow'
import * as path from 'path'
import { Claim } from 'main/app/claims/models/claim'
import { Logger } from '@hmcts/nodejs-logging'
import * as nunjucks from 'nunjucks'
import { app } from 'main/app'

const logger = Logger.getLogger('ClaimStatusFilter')

export function dashboardFilterForClaimant (claim: Claim): string {
  return render(claim, 'claimant')
}

export function dashboardFilterForDefendant (claim: Claim): string {
  return render(claim, 'defendant')
}

function render (claim: Claim, type: string): string {
  const fullPath = path.join(
    __dirname,
    '../views',
    'status',
    type,
    ClaimStatusFlow.dashboardFor(claim) + '.njk')
  try {
    const template = nunjucks.render(fullPath, { claim: claim })
    return app.settings.nunjucksEnv.filters['safe'](template)
  } catch (err) {
    logger.error(`view not found for path: ${fullPath}`)
    return ''
  }
}
