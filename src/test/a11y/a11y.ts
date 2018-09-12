/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
/* tslint:disable:no-console */

import * as config from 'config'
import * as supertest from 'supertest'
import * as pa11y from 'pa11y'
import { expect } from 'chai'

import { RoutablePath } from 'shared/router/routablePath'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import { ErrorPaths as ClaimIssueErrorPaths, Paths as ClaimIssuePaths } from 'claim/paths'
import { ErrorPaths as DefendantFirstContactErrorPaths, Paths as DefendantFirstContactPaths } from 'first-contact/paths'
import { FullAdmissionPaths, Paths as DefendantResponsePaths, StatementOfMeansPaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { Paths as CCJPaths } from 'ccj/paths'
import { Paths as OfferPaths } from 'offer/paths'

import 'test/a11y/mocks'
import { app } from 'main/app'

app.locals.csrf = 'dummy-token'

const cookieName: string = config.get<string>('session.cookieName')

const agent = supertest.agent(app)

interface Issue {
  type
}

async function runPa11y (url: string): Promise<Issue[]> {
  const result = await pa11y(url, {
    headers: {
      Cookie: `${cookieName}=ABC`
    },
    chromeLaunchConfig: {
      args: ['--no-sandbox']
    }
  })
  return result.issues
}

async function check (uri: string) {
  const text = await extractPageText(uri)
  ensureHeadingIsIncludedInPageTitle(text)

  const issues: Issue[] = await runPa11y(agent.get(uri).url)
  ensureNoAccessibilityErrors(issues)
}

async function extractPageText (url: string): Promise<string> {
  const res: supertest.Response = await agent.get(url)
    .set('Cookie', `${cookieName}=ABC;state=000MC000`)

  if (res.redirect) {
    throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`)
  }

  if (!res.ok) {
    throw new Error(`Call to ${url} resulted in ${res.status}`)
  }

  return res.text
}

function ensureHeadingIsIncludedInPageTitle (text: string): void {
  const title: string = text.match(/<title>(.*)<\/title>/)[1]
  const heading: RegExpMatchArray = text.match(/<h1 class="heading-large">\s*(.*)\s*<\/h1>/)

  if (heading) { // Some pages does not have heading section e.g. confirmation pages
    expect(title).to.be.equal(`${heading[1]} - Money Claims`)
  } else {
    expect(title).to.be.not.equal(' - Money Claims')
    console.log(`NOTE: No heading found on page titled '${title}' exists`)
  }
}

function ensureNoAccessibilityErrors (issues: Issue[]): void {
  const errors: Issue[] = issues.filter((issue: Issue) => issue.type === 'error')
  expect(errors, `\n${JSON.stringify(errors, null, 2)}\n`).to.be.empty
}

// better to find the number of processors available?
const LIMIT: number = (process.env.PARALLA11Y || 'FALSE').toUpperCase() === 'TRUE' ? 8 : 1

const excludedPaths: RoutablePath[] = [
  ClaimIssuePaths.startPaymentReceiver,
  ClaimIssuePaths.finishPaymentReceiver,
  ClaimIssuePaths.receiptReceiver,
  ClaimIssuePaths.sealedClaimPdfReceiver,
  DefendantResponsePaths.receiptReceiver,
  DefendantResponsePaths.legacyDashboardRedirect,
  OfferPaths.agreementReceiver,
  DefendantFirstContactPaths.receiptReceiver,
  ClaimantResponsePaths.receiptReceiver
]

describe('Accessibility', () => {const analysisQueue: string[] = []
  const analysesRunning: string[] = []
  let analysisStarted: boolean = false
  const analysisProblems: string[] = []

  function queueForAnalysis (uri: string) {
    analysisQueue.push(uri)
  }

  async function startAnalysis () {
    const onfulfilled = function (uri: string) {
      console.log('onfulfilled')
      analysesRunning.splice(analysesRunning.indexOf(uri), 1)
    }
    const onrejected = function (uri: string, reason: string) {
      console.log(`onrejected(${reason})`)
      analysesRunning.splice(analysesRunning.indexOf(uri), 1)
      analysisProblems.push(reason)
    }

    analysisStarted = true
    while (analysisQueue.length > 0) {
      console.log('analysis loop start')
      while (analysesRunning.length >= LIMIT) {
        await sleep(100)
      }
      const uri: string = analysisQueue.pop()
      analysesRunning.push(uri)
      console.log(`check(${uri})`)
      check(uri)
        .then(() => onfulfilled(uri))
        .catch(reason => onrejected(uri, reason))
      console.log('analysis loop end ' + analysisQueue.length)
    }
    console.log('END startAnalysis()')
    analysisStarted = false
  }

  const paths: RoutablePath[] = [
    ...Object.values(CCJPaths),
    ...Object.values(ClaimIssuePaths),
    ...Object.values(ClaimIssueErrorPaths),
    ...Object.values(ClaimantResponsePaths),
    ...Object.values(EligibilityPaths),
    ...Object.values(DefendantFirstContactPaths),
    ...Object.values(DefendantFirstContactErrorPaths),
    ...Object.values(OfferPaths),
    ...Object.values(DefendantResponsePaths),
    ...Object.values(StatementOfMeansPaths),
    ...Object.values(FullAdmissionPaths)
  ]

  excludedPaths.forEach(excludedPath => paths.splice(paths.indexOf(excludedPath as RoutablePath), 1))

  paths.forEach(path => {
    const uri: string = path.uri.includes(':externalId')
      ? path.evaluateUri({ externalId: '91e1c70f-7d2c-4c1e-a88f-cbb02c0e64d6' })
      : path.uri
    queueForAnalysis(uri)
  })

  startAnalysis()

  it('should find no problems', async () => {
    while (!analysisStarted) {
      console.log('Waiting for analysis to start')
      await sleep(100)
    }
    console.log('Analysis has started')
    while (analysisQueue.length > 0) {
      console.log(`Waiting for the analysis queue to be consumed (${analysesRunning.length}:${analysisQueue.length})`)
      await sleep(1000)
    }
    console.log('Analysis queue has been consumed')
    while (analysesRunning.length > 0) {
      console.log('Waiting for final analyses to finish')
      await sleep(100)
    }
    console.log('All analyses finished')
    expect(analysisProblems).to.be.empty
  })
})

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
